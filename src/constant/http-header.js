const PinpointHeader = {
  HTTP_TRACE_ID : 'Pinpoint-TraceID',
  HTTP_SPAN_ID : 'Pinpoint-SpanID',
  HTTP_PARENT_SPAN_ID : 'Pinpoint-pSpanID',
  HTTP_SAMPLED : 'Pinpoint-Sampled',
  HTTP_FLAGS : 'Pinpoint-Flags',
  HTTP_PARENT_APPLICATION_NAME : 'Pinpoint-pAppName',
  HTTP_PARENT_APPLICATION_TYPE : 'Pinpoint-pAppType',
  HTTP_PARENT_APPLICATION_NAMESPACE : 'Pinpoint-pAppNamespace',
  HTTP_HOST : 'Pinpoint-Host',
  HTTP_PROXY_NGINX : 'Pinpoint-ProxyNginx',
  HTTP_PROXY_APACHE : 'Pinpoint-ProxyApache',
  HTTP_PROXY_APP : 'Pinpoint-ProxyApp',
}

module.exports = {
  PinpointHeader,
}
