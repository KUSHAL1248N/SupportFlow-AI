import { parseClassification } from './ai.service';
import { TicketCategory, TicketPriority, TicketSentiment } from '../tickets/schemas/ticket.schema';

describe('parseClassification', () => {
  it('accepts valid model JSON', () => {
    expect(parseClassification('{"category":"billing","priority":"high","sentiment":"negative"}')).toEqual({
      category: TicketCategory.BILLING,
      priority: TicketPriority.HIGH,
      sentiment: TicketSentiment.NEGATIVE,
    });
  });
  it('falls back to safe enums for out-of-range model values', () => {
    expect(parseClassification('{"category":"delete_everything","priority":"p0","sentiment":"angry"}')).toEqual({
      category: TicketCategory.OTHER,
      priority: TicketPriority.MEDIUM,
      sentiment: TicketSentiment.NEUTRAL,
    });
  });
});
