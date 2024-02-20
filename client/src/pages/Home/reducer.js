import { produce } from 'immer';
import {} from './constants';

export const initialState = {
  latestCreatedItem: [
    {
      id: 1,
      itemName: 'test item asdwwd adw asd wasd',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
  ],
  fiveMinOngoingBid: [
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
  ],
  categories: [
    {
      id: 1,
      pictureUrl: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      name: 'Electronics',
    },
    {
      id: 2,
      pictureUrl: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      name: 'Vehicles',
    },
    {
      id: 3,
      pictureUrl: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      name: 'Jewerly',
    },
    {
      id: 4,
      pictureUrl: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      name: 'Hobbies',
    },
    {
      id: 5,
      pictureUrl: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      name: 'Other',
    },
  ],
  searchResults: [
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
    {
      id: 1,
      itemName: 'test item',
      itemPicture: 'https://res.cloudinary.com/dwyzuwtel/image/upload/v1706151163/cld-sample-3.jpg',
      startingBid: 1000,
      endBid: '2024-02-29 00:00:00',
    },
  ],
};

export const storedKey = [];

const homeReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
    }
  });

export default homeReducer;
