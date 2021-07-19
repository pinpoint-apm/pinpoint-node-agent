# script
https://github.com/grpc/grpc/tree/v1.32.0/examples/node/static_codegen
```
$ export PATH="$PATH:$(npm bin -g)"

$ grpc_tools_node_protoc --version
libprotoc 3.14.0

$ cd grpc-idl/proto
$ grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../../../lib/data --grpc_out=grpc_js:../../../lib/data --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` v1/*.proto
```