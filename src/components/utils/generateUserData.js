import { allFakers } from "@faker-js/faker";

export const generateUserData = (region, numberOfUsers, seed) => {
  const fakeData = [];
  const fakeUser = allFakers[region];

  if (!fakeUser) {
    console.error("Invalid region:", region);
    return fakeData;
  }

  fakeUser.seed(seed);

  for (let i = 0; i < numberOfUsers; i++) {
    const index = i + 1;
    const id = fakeUser.string.uuid();
    const name = fakeUser.person.fullName();
    const address = fakeUser.location.streetAddress({
      useFullAddress: true,
    });
    const phone = fakeUser.phone.number();

    fakeData.push({
      key: index,
      id: id,
      name: name,
      address: address,
      phone: phone,
    });
  }

  return fakeData;
};
