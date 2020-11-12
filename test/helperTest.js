const { getUserByEmail, generateRandomString, urlsForUser } = require('../helpers');
const assert = require('chai').assert;
const expect = require('chai').expect;

describe('#getUserByEmail', () => {
  it('returns a user from a database using email when user exists', () => {
    const userDB = {
      Alice:
      { id: 'thisID',
        email: 'thisguy@tinytim.com'
      }};
    const expectedUser = 'Alice'
    assert.equal(expectedUser, getUserByEmail('thisguy@tinytim.com', userDB));
  });
  it('returns undefined when user doesn\'t exist in database', () => {
    const userDB = {
      Alice:
      { id: 'thisID',
        email: 'thisguy@tinytim.com'
      }};
    const expectedOutput = undefined
    assert.equal(expectedOutput, getUserByEmail('bobthebuilder@building.com'));
  })
  it('returns undefined when the database is empty', () => {
    const userDB = {};
    const expectedOutput = undefined;
    assert.equal(expectedOutput, getUserByEmail('anemail@email.com'));
  })
});

describe('#urlsForUser', () => {
  it('returns an object with urls when the proper user is accessing them', () => {
    const urlDB = {
      uuuuu:
      { userID: 'thisID',
        longURL: 'website.com'
      },
      aaaaa:
      { userID: 'wrongID',
        longURL: 'funnycatphotos.org'
      },
      ooooo:
      { userID: 'thisID',
        longURL: 'dadjokes.com'
      }
    };
    const expectedOutput = { 
      uuuuu:
      { userID: 'thisID',
        longURL: 'website.com'
      },
      ooooo:
      { userID: 'thisID',
        longURL: 'dadjokes.com'
      }
    };
    expect(urlsForUser('thisID', urlDB)).to.eql(expectedOutput);
  });
  it('returns an empty object when user has no associated urls', () => {
    const urlDB = {
      uuuuu:
      { userID: 'ID1',
        longURL: 'website.com'
      },
      aaaaa:
      { userID: 'ID1',
        longURL: 'funnycatphotos.org'
      },
      ooooo:
      { userID: 'ID2',
        longURL: 'dadjokes.com'
      }
    };
    const expectedOutput = {};
    expect(urlsForUser('thisID', urlDB)).to.eql(expectedOutput);
  });
  it('returns an empty object when there is no user', () => {
    const urlDB = {
      uuuuu:
      { userID: 'thisID',
        longURL: 'website.com'
      },
      aaaaa:
      { userID: 'wrongID',
        longURL: 'funnycatphotos.org'
      },
      ooooo:
      { userID: 'thisID',
        longURL: 'dadjokes.com'
      }
    };
    const expectedOutput = {};
    expect(urlsForUser(undefined, urlDB)).to.eql(expectedOutput);
  });
});