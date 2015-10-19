import chai, {expect} from 'chai';
import Tester from '../Tester/Tester.js';

describe('Tester', function(done) {

  context('Create a Tester instance: from tester_config', function(done) {
    it('should have a array property with 2 json objects', () => {
      try {
        let tester = new Tester();
        expect(tester.scenarioList).to.be.instanceof(Array);
        expect(tester.scenarioList[0]).to.have.property('case1');
        expect(tester.scenarioList[1]).to.have.property('case2');
      } catch(err) {
        expect(err).to.be.empty;
      }
    });
  });

});
