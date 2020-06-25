'use strict'

const instManager = require('./instrumentation/inst-manager')
const traceContext = require('./context/trace-context')
const log = require('./utils/logger')
const stringMetaService = require('./context/string-meta-service')
const apiMetaService = require('./context/api-meta-service')
const sampler = require('./sampler/sampler')
const Scheduler = require('./utils/scheduler')
const AgentStatsMonitor = require('./metric/agent-stats-monitor')
const getConfig = require('./config').getConfig
const PinpointClient = require('./client/pinpoint-client')
const dataSenderFactory = require('./client/data-sender-factory')
const AgentInfo = require('./data/dto/agent-info')
const agentPackage = require('../package')
const wrapped = Symbol('pinpoint-wrapped-function')
const PinScheduler = require('./metric/ping-scheduler')

class Agent {
  constructor (initOptions) {
    this.config = getConfig(initOptions)

    log.debug('[Pinpoint Agent] Configuration', this.config)

    if (!this.config.enable || this.config.enable.toString() !== 'true') {
      global.__PINPOINT_ENABLED__ = false
      log.warn('[Pinpoint Agent]['+this.config.agentId+'] Disabled')
      return
    }

    global.__PINPOINT_ENABLED__ = true
    log.warn('[Pinpoint Agent]['+this.config.agentId+'] Init Started')

    const agentId = this.config.agentId
    const agentStartTime = Date.now()
    this.agentInfo = this.createAgentInfo(this.config, agentStartTime)

    this.initializeDataSender()
    this.initializePinpointClient();

    this.isSampling = sampler.getIsSampling(this.config.sampling, this.config.sampleRate)
    this.traceContext = traceContext.init(this.agentInfo, this.dataSender)

    stringMetaService.init(this.dataSender)
    apiMetaService.init(this.dataSender)

    this.startSchedule(agentId, agentStartTime);
    this.initailizeSupportModules();

    this.pingScheduler = new PinScheduler(this.dataSender)

    log.warn('[Pinpoint Agent][' + agentId + '] Init Completed')
  }

  initializeDataSender() {
    this.dataSender = dataSenderFactory.create(this.config, this.agentInfo)
    this.dataSender.send(this.agentInfo)
  }

  initailizeSupportModules() {
    this.loadedModule = [];
    instManager.init(this);
  }

  initializePinpointClient() {
    this.pinpointClient = new PinpointClient(this.config, this.agentInfo, this.dataSender)
  }

  createTraceObject (requestData) {
    if (!requestData || requestData.isRoot) {
      return this.traceContext.newTraceObject(this.isSampling())
    } else {
      return this.traceContext.continueTraceObject(requestData)
    }
  }

  currentTraceObject () {
    return this.traceContext.currentTraceObject()
  }

  completeTraceObject (trace) {
    this.traceContext.completeTraceObject(trace)
    if (trace.span) {
      /*
      const spanEvent = []
      // step1. 우선 비동기 코드 (추후 더미코드) 를 먼저 가져오도록 한다.
      const dummyEventMap = trace.span.spanEventList.reduce((map, dummyEvent) => {
        if (dummyEvent.serviceType === ServiceTypeCode.callback_dummy) {
          map[dummyEvent.nextDummyId] = dummyEvent
        }
        return map
      }, {})
      // step2. 콜백코드로 저장된 걸 가져오도록 한다. (순서가 보장 안되기 때문에 해당 과정이 필요하다.. )
      const callEvent = trace.span.spanEventList.reduce((map, callbackEvent) => {
        if (callbackEvent.dummyId !== null) {
          map.push(callbackEvent)
        }
        return map
      }, [])
      // step3. 비동기 코드를 순차적으로 우회하며 돌도록 한다.
      callEvent.forEach((event) => {
        const dummyRecoder = dummyEventMap[event.dummyId]
        if (dummyRecoder) {
          event.sequence = dummyRecoder.sequence
          event.depth = dummyRecoder.depth
          //TODO. agent view 에서 문제가 있기에 우선 임의로 넣어둔다. (paas와 논의 필요)
          // event.startElapsed = dummyRecoder.startElapsed
          // event.elapsedTime = dummyRecoder.elapsedTime

          if (event.nextDummyId !== null) {
            //TODO. event chaiing인 경우 depth 등을 조정해야한다. 순서가 보장안될 수 있으니.. 차순 변경 후 가도 될 듯
            dummyEventMap[event.nextDummyId].sequence = event.sequence + 1
            dummyEventMap[event.nextDummyId].depth = event.depth + 1
          }
        }
      })

      trace.span.spanEventList.forEach((event) => {
        if (event.serviceType !== ServiceTypeCode.callback_dummy) {
          spanEvent.push(event)
        }
      })
      trace.span.spanEventList = spanEvent
      log.debug('finally->\n', trace.span)
      */
    }
  }

  includedModules (moduleName) {
    return !this.loadedModule.includes(moduleName)
  }

  setModules (moduleName) {
    this.loadedModule.push(moduleName)
  }

  createAgentInfo (config, agentStartTime) {
    return AgentInfo.create(config, agentStartTime)
  }

  startSchedule(agentId, agentStartTime) {
    this.mainScheduler = new Scheduler(5000);
    if (this.config.enabledStatsMonitor) {
      const agentStatsMonitor = new AgentStatsMonitor(this.pinpointClient.dataSender, agentId, agentStartTime)
      this.mainScheduler.addJob(() => { agentStatsMonitor.run() })
    }
    this.mainScheduler.start();
  }

  spanEndCallbackWrapper(trace, spanEventRecorder, original) {
    if (typeof original !== 'function' || original.name === 'pinpointCallbackWrapper') return original

    if (trace && !trace.canSampled()) {
      return original
    }

    original[wrapped] = pinpointCallbackWrapper

    return pinpointCallbackWrapper

    function pinpointCallbackWrapper() {
      const result = original.apply(this, arguments)
      return result
    }
  }
}

module.exports = Agent
