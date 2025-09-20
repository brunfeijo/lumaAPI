/// <reference types="cypress" />
import ApiClient from "../pageObjects/ApiClient";

const api = new ApiClient();

describe("GET /objects — list", () => {
  it("returns a non-empty array", () => {
    api.expectListNotEmpty();
  });
});

describe("GET /objects/:id — mock by id", () => {
  it("fetches an existing mock by ID and validates shape", () => {
    api.fetchAnyExistingId().then((id) => {
      api.getObject(id).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(resp.body).to.have.property("id", String(id));
        expect(resp.body).to.have.property("name");
      });
    });
  });
});

describe("POST /objects — create", () => {
  it("creates a new resource and verifies read-back", () => {
    api.createAndVerify();
  });
});

describe("PUT /objects/:id — update", () => {
  let id: string;
  let originalName: string;
  beforeEach(() => {
    return api.createAndVerify().then(({ id: createdId, created }) => {
      id = createdId;
      originalName = created.name;
    });
  });

  it("updates the object and verifies the new values", () => {
    const updated = {
      name: originalName + " (updated)",
      data: { color: "midnight" },
    } as const;
    return api.updateAndVerify(id, updated);
  });
});

describe("DELETE /objects/:id — delete", () => {
  let id: string;
  beforeEach(() => {
    return api.createAndVerify().then(({ id: createdId }) => {
      id = createdId;
    });
  });

  it("deletes the resource and confirms absence", () => {
    return api.deleteAndVerifyGone(id);
  });
});
