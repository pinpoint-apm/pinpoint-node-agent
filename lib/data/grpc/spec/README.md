# script
https://github.com/grpc/grpc/tree/v1.32.0/examples/node/static_codegen
```
$ export PATH="$PATH:$(npm bin -g)"
$ grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../ --grpc_out=grpc_js:../  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` Span.proto
$ grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../ --grpc_out=grpc_js:../  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` Service.proto
$ grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../ --grpc_out=grpc_js:../  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` Cmd.proto
$ grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../ --grpc_out=grpc_js:../  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` Annotation.proto
$ grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../ --grpc_out=grpc_js:../  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` Stat.proto
$ grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../ --grpc_out=grpc_js:../  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` ThreadDump.proto
```