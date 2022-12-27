declare namespace Pinpoint {
    export interface Agent {
        start(initOptions: any);
        initializeDataSender(): void;
        initializeSupportModules(): void;
        initializePinpointClient(): void;
        createTraceObject(requestData: any): Trace;
        currentTraceObject(): any;
        completeTraceObject(trace: any): void;
        createAgentInfo(config: any, agentStartTime: any): AgentInfo;
        startSchedule(agentId: any, agentStartTime: any): void;
        spanEndCallbackWrapper(trace: any, spanEventRecorder: any, original: any): any;
    }

    export interface Trace {
    }

    export interface AgentInfo {
    }
}
declare const pinpointAgent: Pinpoint.Agent;
export = pinpointAgent;