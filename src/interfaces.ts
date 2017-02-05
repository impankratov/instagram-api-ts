export interface Options {
  accessToken: string;
  clientId?: string;
  base?: string;
}

export interface Envelope {
  meta: {
    code: number
  };
  data: any;
}

export interface EnvelopeError extends Envelope {
  meta: {
    code: number
    error_type: string;
    error_message: string;
  };
}

export interface EnvelopeWithPagination extends Envelope {
  pagination: {
    next_url?: string,
    next_max_id?: string
  }
}

