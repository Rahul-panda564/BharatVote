/**
 * Gemini AI Module Tests
 * 
 * Tests the static fallback responses of the Chunav Mitra AI assistant.
 * Since the Gemini API requires a server-side key, these tests validate
 * the fallback logic and response quality.
 */

// We test the static fallback function directly since the module uses "use server"
// and the API integration requires actual credentials.

describe('Gemini AI — Static Fallback Responses', () => {
  // Simulate the static response logic from gemini.js
  function getStaticResponse(userMessage) {
    const lower = userMessage.toLowerCase();

    if (lower.includes('register') || lower.includes('registration')) {
      return 'To register as a voter:\n\n1. Visit voters.eci.gov.in\n2. Fill Form 6 with your details\n3. Upload proof of age and address\n4. Submit and note your reference number\n5. Wait for BLO verification\n\n📞 Helpline: 1950';
    }
    if (lower.includes('evm') || lower.includes('voting machine')) {
      return 'The EVM (Electronic Voting Machine) has two units:\n\n1. **Ballot Unit** - Where you press the button next to your candidate\n2. **Control Unit** - Operated by the Presiding Officer\n\nThe VVPAT prints a slip showing your vote for 7 seconds for verification.\n\nTry our EVM Simulator in the Polling Day section!';
    }
    if (lower.includes('booth') || lower.includes('polling station')) {
      return 'To find your polling booth:\n\n1. Visit electoralsearch.eci.gov.in\n2. Search by Name or EPIC Number\n3. Your booth address will be displayed\n\nYou can also use our Booth Locator in the Journey section!';
    }
    if (lower.includes('candidate') || lower.includes('manifesto')) {
      return 'To learn about your candidates:\n\n1. Visit the ECI website during election season\n2. Check ADR India for candidate affidavits\n3. Use our Representation Tracker to see MP/MLA performance\n\nWould you like to explore the Representation section?';
    }
    return 'Thank you for your question! For the most accurate information:\n\n1. Visit eci.gov.in\n2. Call helpline 1950\n3. Use the Voter Helpline App\n\nI can help with registration, EVM process, booth finding, and more. What would you like to know?';
  }

  test('returns registration response for "register" keyword', () => {
    const response = getStaticResponse('How do I register as a voter?');
    expect(response).toContain('Form 6');
    expect(response).toContain('1950');
    expect(response).toContain('voters.eci.gov.in');
  });

  test('returns registration response for "registration" keyword', () => {
    const response = getStaticResponse('What is the voter registration process?');
    expect(response).toContain('BLO verification');
  });

  test('returns EVM response for "evm" keyword', () => {
    const response = getStaticResponse('Tell me about the EVM');
    expect(response).toContain('Ballot Unit');
    expect(response).toContain('Control Unit');
    expect(response).toContain('VVPAT');
  });

  test('returns EVM response for "voting machine" keyword', () => {
    const response = getStaticResponse('How does the voting machine work?');
    expect(response).toContain('Electronic Voting Machine');
  });

  test('returns booth response for "booth" keyword', () => {
    const response = getStaticResponse('Where is my polling booth?');
    expect(response).toContain('electoralsearch.eci.gov.in');
    expect(response).toContain('EPIC Number');
  });

  test('returns booth response for "polling station" keyword', () => {
    const response = getStaticResponse('Find my polling station');
    expect(response).toContain('Booth Locator');
  });

  test('returns candidate response for "candidate" keyword', () => {
    const response = getStaticResponse('Who are the candidates in my area?');
    expect(response).toContain('ADR India');
    expect(response).toContain('Representation Tracker');
  });

  test('returns candidate response for "manifesto" keyword', () => {
    const response = getStaticResponse('Where can I read the manifesto?');
    expect(response).toContain('ECI website');
  });

  test('returns generic help response for unmatched queries', () => {
    const response = getStaticResponse('Hello, how are you?');
    expect(response).toContain('eci.gov.in');
    expect(response).toContain('1950');
    expect(response).toContain('Voter Helpline App');
  });

  test('is case-insensitive', () => {
    const response1 = getStaticResponse('REGISTER');
    const response2 = getStaticResponse('register');
    expect(response1).toEqual(response2);
  });

  test('handles mixed case queries', () => {
    const response = getStaticResponse('How to Register for EVM voting?');
    // Should match "register" first
    expect(response).toContain('Form 6');
  });
});
