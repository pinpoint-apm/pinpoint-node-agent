const test = require('tape')
const agent = require('../../support/agent-singleton-mock')
const {
    GenericContainer
} = require("testcontainers")

test(`mongodb`, async (t) => {
    const container = await new GenericContainer("mongo")
        .withExposedPorts(27017)
        .start()

    agent.bindHttp()

    const trace = agent.createTraceObject()
    const mongoose = require('mongoose');
    mongoose.connect(`mongodb://${container.getContainerIpAddress()}:${container.getMappedPort(27017)}/test`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const Cat = mongoose.model('Cat', {
        name: String
    });

    const kitty = new Cat({
        name: 'Zildjian'
    });

    t.plan(1)
    kitty.save().then(async () => {
        agent.completeTraceObject(trace)

        
        t.true(true)

        await mongoose.disconnect()
        await container.stop()
    });

})