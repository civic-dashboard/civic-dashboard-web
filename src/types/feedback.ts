export type FeedbackPayload =
  | { type: 'text'; message: string; name: string }
  | {
      type: 'interview';
      name: string;
      email: string;
      availability: string;
      anythingElse: string;
    };
