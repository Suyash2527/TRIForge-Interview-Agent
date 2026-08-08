import '@testing-library/jest-dom'

// Mock matchMedia which is not present in JSDOM but might be used by components or dependencies
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollIntoView which is not implemented in JSDOM
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock Headers
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    map = new Map();
    constructor(init?: any) {
      if (init) Object.entries(init).forEach(([k, v]) => this.map.set(k.toLowerCase(), v));
    }
    get(name: string) { return this.map.get(name.toLowerCase()) || null; }
    set(name: string, value: string) { this.map.set(name.toLowerCase(), value); }
    has(name: string) { return this.map.has(name.toLowerCase()); }
    forEach(cb: any) { this.map.forEach(cb); }
    entries() { return this.map.entries(); }
  } as any;
}

// Mock Request object if it's missing in JSDOM
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    url: string;
    method: string;
    headers: any;
    body: any;
    constructor(input: string, init?: any) {
      this.url = input;
      this.method = init?.method || 'GET';
      this.headers = new global.Headers(init?.headers);
      this.body = init?.body || null;
    }
    async json() {
      if (typeof this.body === 'string') return JSON.parse(this.body);
      return this.body;
    }
    async text() {
      return this.body?.toString() || '';
    }
  } as any;
}

// Mock Response object if it's missing in JSDOM
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    body: any;
    status: number;
    headers: any;
    constructor(body?: any, init?: any) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new global.Headers(init?.headers);
    }
    static json(data: any, init?: any) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {})
        }
      });
    }
    async json() {
      if (typeof this.body === 'string') return JSON.parse(this.body);
      return this.body;
    }
    async text() {
      return this.body?.toString() || '';
    }
  } as any;
}
