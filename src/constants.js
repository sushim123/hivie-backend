export const API_INSTA_GRAPH = 'https://graph.facebook.com/v20.0/17841468546353221';
export const OPTIONS_INSTA =
  '{id,username,name,profile_picture_url,followers_count,follows_count,media_count,media{id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count}}';
export const INSTA_REDIRECT_URL = `https://localhost:4000/api/v1/insta/auth/callback`;
export const INSTA_URL = `https://api.instagram.com/oauth`;
export const INSTA_GRAPH_URL = 'https://graph.instagram.com/me';
export const STATUS_CODES = {
  // 2xx Success - The request was successfully received, understood, and accepted.
  OK: 200, // Standard response for successful HTTP requests.
  CREATED: 201, // The request has been fulfilled, resulting in the creation of a new resource.
  ACCEPTED: 202, // The request has been accepted for processing, but the processing is not complete.
  NO_CONTENT: 204, // The server successfully processed the request, but is not returning any content.

  // 3xx Redirection - Further action needs to be taken by the user agent in order to fulfill the request.
  MOVED_PERMANENTLY: 301, // The requested resource has been permanently moved to a new URI.
  FOUND: 302, // The resource was found at another URI but the client should use the original URI.
  SEE_OTHER: 303, // The response can be found at another URI using a GET method.
  NOT_MODIFIED: 304, // Indicates that the resource has not been modified since the last request.
  TEMPORARY_REDIRECT: 307, // The request should be repeated with another URI; however, future requests should still use the original URI.
  PERMANENT_REDIRECT: 308, // The request and all future requests should be repeated using another URI.

  // 4xx Client Errors - The request contains bad syntax or cannot be fulfilled.
  BAD_REQUEST: 400, // The server could not understand the request due to invalid syntax.
  UNAUTHORIZED: 401, // The client must authenticate itself to get the requested response.
  PAYMENT_REQUIRED: 402, // Reserved for future use; sometimes used for digital payment systems.
  FORBIDDEN: 403, // The client does not have access rights to the content.
  NOT_FOUND: 404, // The server can not find the requested resource.
  METHOD_NOT_ALLOWED: 405, // The request method is known by the server but is not supported by the target resource.
  NOT_ACCEPTABLE: 406, // The server cannot produce a response matching the list of acceptable values defined in the request's headers.
  PROXY_AUTHENTICATION_REQUIRED: 407, // The client must first authenticate itself with the proxy.
  REQUEST_TIMEOUT: 408, // The server timed out waiting for the request.
  CONFLICT: 409, // The request could not be processed because of a conflict in the current state of the resource.
  GONE: 410, // The requested resource is no longer available and will not be available again.
  LENGTH_REQUIRED: 411, // The request did not specify the length of its content, which is required by the requested resource.
  PRECONDITION_FAILED: 412, // The server does not meet one of the preconditions that the requester put on the request.
  PAYLOAD_TOO_LARGE: 413, // The request is larger than the server is willing or able to process.
  URI_TOO_LONG: 414, // The URI provided was too long for the server to process.
  UNSUPPORTED_MEDIA_TYPE: 415, // The request entity has a media type which the server or resource does not support.
  RANGE_NOT_SATISFIABLE: 416, // The client has asked for a portion of the file, but the server cannot supply that portion.
  EXPECTATION_FAILED: 417, // The server cannot meet the requirements of the Expect request-header field.
  IM_A_TEAPOT: 418, // This code was defined as an April Fools' joke and is not expected to be implemented by actual HTTP servers.
  UNPROCESSABLE_ENTITY: 422, // The request was well-formed but was unable to be followed due to semantic errors.
  TOO_MANY_REQUESTS: 429, // The user has sent too many requests in a given amount of time ("rate limiting").

  // 5xx Server Errors - The server failed to fulfill a valid request.
  INTERNAL_SERVER_ERROR: 500, // The server has encountered a situation it doesn't know how to handle.
  NOT_IMPLEMENTED: 501, // The request method is not supported by the server and cannot be handled.
  BAD_GATEWAY: 502, // The server, while acting as a gateway or proxy, received an invalid response from an inbound server.
  SERVICE_UNAVAILABLE: 503, // The server is not ready to handle the request, typically due to overload or maintenance.
  GATEWAY_TIMEOUT: 504, // The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.
  HTTP_VERSION_NOT_SUPPORTED: 505, // The HTTP version used in the request is not supported by the server.
  VARIANT_ALSO_NEGOTIATES: 506, // The server has an internal configuration error: the chosen variant resource is configured to engage in content negotiation itself.
  INSUFFICIENT_STORAGE: 507, // The server is unable to store the representation needed to complete the request.
  LOOP_DETECTED: 508, // The server detected an infinite loop while processing a request.
  NOT_EXTENDED: 510, // Further extensions to the request are required for the server to fulfill it.
  NETWORK_AUTHENTICATION_REQUIRED: 511 // The client needs to authenticate to gain network access.
};

export const DUPLICATE_ERROR_CODE = 11000;
export const START_OF_DAY = 'T00:00:00.000Z';
export const END_OF_DAY = 'T23:59:59.999Z';
