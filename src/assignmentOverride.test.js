import Assignment from './assignment';
import AssignmentOverride from './assignmentOverride';
import TestTrackConfig from './testTrackConfig'; // eslint-disable-line no-unused-vars
import Visitor from './visitor';

jest.mock('./testTrackConfig', () => {
  return {
    getUrl: () => 'http://testtrack.dev'
  };
});

describe('AssignmentOverride', () => {
  let overrideOptions;
  function createOverride() {
    return new AssignmentOverride(overrideOptions);
  }

  let testContext;
  beforeEach(() => {
    testContext = {};
    window.fetch = jest.fn().mockResolvedValue();

    testContext.visitor = new Visitor({
      id: 'visitorId',
      assignments: []
    });
    testContext.visitor.logError = jest.fn();

    testContext.assignment = new Assignment({
      splitName: 'jabba',
      variant: 'cgi',
      context: 'spec',
      isUnsynced: false
    });

    overrideOptions = {
      visitor: testContext.visitor,
      assignment: testContext.assignment,
      username: 'the_username',
      password: 'the_password'
    };

    testContext.override = createOverride();
  });

  it('requires a visitor', () => {
    expect(function() {
      delete overrideOptions.visitor;
      createOverride();
    }).toThrow('must provide visitor');
  });

  it('requires an assignment', () => {
    expect(function() {
      delete overrideOptions.assignment;
      createOverride();
    }).toThrow('must provide assignment');
  });

  it('requires an username', () => {
    expect(function() {
      delete overrideOptions.username;
      createOverride();
    }).toThrow('must provide username');
  });

  it('requires a password', () => {
    expect(function() {
      delete overrideOptions.password;
      createOverride();
    }).toThrow('must provide password');
  });

  describe('#persistAssignment()', () => {
    it('creates an assignment on the test track server', () => {
      testContext.override.persistAssignment();

      expect(window.fetch).toHaveBeenCalledTimes(1);
      expect(window.fetch).toHaveBeenCalledWith('http://testtrack.dev/api/v1/assignment_override', {
        method: 'post',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic dGhlX3VzZXJuYW1lOnRoZV9wYXNzd29yZA=='
        },
        body:
          '{"visitor_id":"visitorId","split_name":"jabba","variant":"cgi","context":"spec","mixpanel_result":"success"}'
      });
    });

    it('logs an error if the request fails', () => {
      window.fetch = jest.fn().mockRejectedValue(new Error('something went wrong'));

      expect.assertions(2);
      return testContext.override.persistAssignment().then(() => {
        expect(testContext.visitor.logError).toHaveBeenCalledTimes(1);
        expect(testContext.visitor.logError).toHaveBeenCalledWith(
          'test_track persistAssignment error: Error: something went wrong'
        );
      });
    });

    it('logs an error if the request returns a non-200', () => {
      window.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, body: 'body' });

      expect.assertions(2);
      return testContext.override.persistAssignment().then(() => {
        expect(testContext.visitor.logError).toHaveBeenCalledTimes(1);
        expect(testContext.visitor.logError).toHaveBeenCalledWith(
          'test_track persistAssignment error: Error: Unexpected status: 500, body'
        );
      });
    });
  });
});
