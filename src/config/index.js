export default {
    api: {
        url: is_dev ? "127.0.0.1" : "api",
        port: 8888
    },
    ws: {
        url: is_dev ? "localhost" : "api",
        port: 8889
    }
}