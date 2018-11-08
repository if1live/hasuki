import '../shims';
import Dexie from 'dexie';

// https://github.com/dfahlander/Dexie.js/blob/master/samples/typescript-simple/app.ts

interface Friend {
  id?: number;
  name?: string;
  age?: number;
}

class FriendDatabase extends Dexie {
  public friends: Dexie.Table<Friend, number>;

  constructor() {
    super('friend_database');
    this.version(1).stores({
      friends: '++id,name,age',
    });
  }
}

const db = new FriendDatabase();

beforeEach(async () => {
  await db.friends.clear();
});

test('friend_database', async () => {
  try {
    const friend = { name: 'Josephine', age: 21 };
    await db.friends.add(friend);

    const friends = await db.friends.where('age').below(25).toArray();
    expect(friends).toHaveLength(1);
    expect(friends[0]).toEqual(friend);

  } catch (e) {
    fail(e);
  }
});
