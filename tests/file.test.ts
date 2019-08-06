/* tslint:disable:no-unused-expression */
import fs from 'fs';
import url from 'url';

import chai, { expect } from 'chai';
import * as faker from 'faker';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { readFile } from '../src/utils/file';

chai.use(sinonChai);
describe('FILE', () => {
  describe('smoke test', () => {
    context('readFile', () => {
      it('should exists', () => {
        expect(readFile).to.exist;
      });

      it('should be a function', () => {
        expect(readFile).to.be.a('function');
      });
    });
  });

  describe('unit tests', () => {
    let fsSpy: sinon.SinonSpy;
    beforeEach(() => {
      fsSpy = sinon.spy(fs, 'readFileSync');
    });

    afterEach(() => {
      fsSpy.restore();
    });

    context('readFile', () => {
      it('should return a file buffer given a valid path', () => {
        const buffer = readFile(url.resolve(__dirname, 'package.json'));
        expect(buffer).to.be.instanceOf(Buffer);
        expect(fsSpy).to.be.calledOnce;
      });

      it('should throws an error given a invalid path', () => {
        expect(() => readFile(url.resolve(__dirname, faker.random.alphaNumeric()))).to.throw();
        expect(fsSpy).to.be.calledOnce;
      });
    });
  });
});
