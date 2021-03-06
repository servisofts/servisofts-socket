import { SSocketConfigProps } from './index';

export const defaultConfig: SSocketConfigProps = {
    name: "glup",
    host: 'glupweb.com', 
    port: {
        native: 10003, // native ssl 'always' active
        web: 20003, // when ssl is enabled, final url will be wss://host/ws/
        http: 30003, // when ssl is enabled final url will be https://host/api/
    },
    ssl: false, // Only for https ans wss connections 
    cert: "MIIDyDCCArCgAwIBAgIEX0XTuDANBgkqhkiG9w0BAQsFADCBpTELMAkGA1UEBhMCQk8xEjAQBgNVBAgMCUF2IEJhbnplcjETMBEGA1UEBwwKU2FudGEgQ3J1ejEXMBUGA1UECgwOU2Vydmlzb2Z0cyBTUkwxDTALBgNVBAsMBGdsdXAxHDAaBgNVBAMME2dsdXAuc2Vydmlzb2Z0cy5jb20xJzAlBgkqhkiG9w0BCQEWGHJpY2t5LnBhei5kLjk3QGdtYWlsLmNvbTAeFw0yMDA4MjYwMzE1MDRaFw0yMDA4MjcwMzE1MDRaMIGlMQswCQYDVQQGEwJCTzESMBAGA1UECAwJQXYgQmFuemVyMRMwEQYDVQQHDApTYW50YSBDcnV6MRcwFQYDVQQKDA5TZXJ2aXNvZnRzIFNSTDENMAsGA1UECwwEZ2x1cDEcMBoGA1UEAwwTZ2x1cC5zZXJ2aXNvZnRzLmNvbTEnMCUGCSqGSIb3DQEJARYYcmlja3kucGF6LmQuOTdAZ21haWwuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkxrsg+TL8eDi/j/tdUJFXNetGMPrxTg4FWLzrumtpU99PYqNn13EutaIv3duKZk32xwhay2hr1eQctJunjIZ0QNYMSmiUgQQ843f9HI4O/IZXjZyKdsHNPdSbNy20V9YlU7sS0WwaJgV8fHNHRZKAcbOWLVkrSTh7pb14NUMny13d5DS4Gh94hrAWPsqQJ1eJidVSnyfB0AIvWk4Y1ghyZU4IHgnIeS9IQrZ4Ou7TQBY8ibT1JPqtM+4HlAy5J+34YrLVaeRaft0HQ0P0JzAjDaMbnt+BY0t5eEmp38XxMfpRDbIiFSbJdzAyn1+UZNn9wT6o+CpnOds7cdPGZjZEQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAjpTKzeLWtRjwtN9ZhXQXZEaqnVCPOQXihzsOfWIAo1b+Fddc6WLCUPikhpknFyCvZNkSXC1RfO0fdH4iVlTlkISKfyM1s5EulDYLC+ZpRQaY/zBZV9GpxkaFUvvTg5nZNM5w7DqWksTbBRL7n0E4vkXb5w0Li4S9obDARB3f1JK6lPy8BZc7Wk6cTi7R0YCy1Lb90Cf4rSl3lplfXu5T1zT4kMu4rustmcnAH99N2PF3nLpbkBsKQOuetWMumjTE/qTowIb+jWTIME39rMTYs8HEOa1lGeYD2aYE97FEgIDsfbvpeykYgMHQ/8Uc1BY9V/dgpblookDxnQdQs3plz"
}