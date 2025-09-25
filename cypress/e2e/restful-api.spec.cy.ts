/// <reference types="cypress" />
import ApiClient from "../pageObjects/ApiClient";

const api = new ApiClient();

// GET /objects — list
describe("GET /objects — list", () => {
  it("GET: a. Fetch all resources and validate the size of the returned list.", () => {
    api.expectListNotEmpty().then((list) => {
      cy.log(`Fetched list with ${list.length} objects`);
    });
  });
});

// GET /objects/:id — by id
describe("GET /objects/:id — mock by id", () => {
  it("GET:b. Fetch a single mock resource by its ID.", () => {
    api.fetchAnyExistingId().then((id) => {
      cy.log(`Using existing object id: ${id}`);
      api.getObject(id).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.have.property("id", String(id));
        expect(resp.body).to.have.property("name");
        cy.log(`Fetched object: ${JSON.stringify(resp.body)}`);
      });
    });
  });
});

// POST /objects — create
describe("POST /objects — create", () => {
  it("POST: a. Create a new resource and store its ID for later use.", () => {
    api.createAndVerify().then(({ id, created }) => {
      cy.log(`Created object id=${id}, name=${created.name}`);
    });
  });
});

// PUT /objects/:id — update
describe("PUT: a. Update a resource you created and confirm that the update was successful.", () => {
  let id: string;
  let originalName: string;

  beforeEach(() => {
    return api.createAndVerify().then(({ id: createdId, created }) => {
      id = createdId;
      originalName = created.name;
      cy.log(`Setup: created object id=${id}, name=${originalName}`);
    });
  });

  it("DELETE a. Delete a resource you created and verify that it no longer exists.", () => {
    const updated = {
      name: originalName + " (updated)",
      data: { color: "midnight" },
    } as const;

    return api.updateAndVerify(id, updated).then((after) => {
      cy.log(
        `Updated object id=${id}, new name=${after.name}, color=${after.data?.color}`
      );
    });
  });
});

// DELETE /objects/:id — delete
describe("DELETE /objects/:id — delete", () => {
  let id: string;

  beforeEach(() => {
    return api.createAndVerify().then(({ id: createdId }) => {
      id = createdId;
      cy.log(`Setup: created object id=${id} for deletion`);
    });
  });

  it("deletes the resource and confirms absence", () => {
    return api.deleteAndVerifyGone(id).then(() => {
      cy.log(`Deleted object id=${id}`);
    });
  });
});
