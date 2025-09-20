/// <reference types="cypress" />

export interface ApiObject {
  id?: string;
  name: string;
  data?: Record<string, unknown>;
}

export default class ApiClient {
  // ===== Low-level HTTP wrappers
  getAllObjects() {
    return cy.request<ApiObject[]>({ method: 'GET', url: '/objects', failOnStatusCode: false });
  }
  getObject(id: string | number) {
    return cy.request<ApiObject>({ method: 'GET', url: `/objects/${id}`, failOnStatusCode: false });
  }
  createObject(body: ApiObject) {
    return cy.request<ApiObject>({ method: 'POST', url: '/objects', body, headers: { 'Content-Type': 'application/json' }, failOnStatusCode: false });
  }
  updateObject(id: string | number, body: ApiObject) {
    return cy.request<ApiObject>({ method: 'PUT', url: `/objects/${id}`, body, headers: { 'Content-Type': 'application/json' }, failOnStatusCode: false });
  }
  deleteObject(id: string | number) {
    return cy.request<unknown>({ method: 'DELETE', url: `/objects/${id}`, failOnStatusCode: false });
  }

  // ===== Test data helpers
  buildPayload(suffix = ''): ApiObject {
    const ts = Date.now();
    return {
      name: `Restore Test Object ${ts}${suffix}`,
      data: { color: 'space-gray', capacity: `${(ts % 512) + 1}GB`, owner: 'QA' },
    };
  }

  // ===== Reusable expectations / flows
  expectListNotEmpty() {
    return this.getAllObjects().then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.be.an('array').and.not.be.empty;
      return resp.body; // chain array forward if caller wants it
    });
  }

  fetchAnyExistingId() {
    return this.expectListNotEmpty().then((list) => {
      const first: any = list[0];
      const id = first?.id ?? first?.ID ?? first?.uuid;
      expect(id, 'an id from the list').to.exist;
      return String(id);
    });
  }

  createAndVerify(payload?: ApiObject) {
    const body = payload ?? this.buildPayload('-AUTO');
    return this.createObject(body).then((resp) => {
      expect(resp.status).to.be.oneOf([200, 201]);
      const id = String(resp.body.id);
      expect(resp.body.name).to.eq(body.name);
      // read-back verification
      return this.getObject(id).then((getResp) => {
        expect(getResp.status).to.eq(200);
        expect(getResp.body.id).to.eq(id);
        expect(getResp.body.name).to.eq(body.name);
        return { id, created: getResp.body };
      });
    });
  }

  updateAndVerify(id: string, updated: ApiObject) {
    return this.updateObject(id, updated).then((putResp) => {
      expect(putResp.status).to.eq(200);
      expect(putResp.body.id).to.eq(String(id));
      expect(putResp.body.name).to.eq(updated.name);
      if (updated.data && 'color' in updated.data) {
        expect(putResp.body.data).to.deep.include({ color: (updated.data as any).color });
      }
      return this.getObject(id).then((getResp) => {
        expect(getResp.status).to.eq(200);
        expect(getResp.body.name).to.eq(updated.name);
        if (updated.data && 'color' in updated.data) {
          expect(getResp.body.data).to.deep.include({ color: (updated.data as any).color });
        }
        return getResp.body;
      });
    });
  }

  deleteAndVerifyGone(id: string) {
    return this.deleteObject(id).then((delResp) => {
      expect(delResp.status).to.be.oneOf([200, 204]);
      return this.getObject(id).then((getResp) => {
        expect([404, 200]).to.include(getResp.status);
        if (getResp.status === 404) return true; // gone
        const msgish = JSON.stringify(getResp.body);
        const looksGone = /doesn\'t exist|not found/i.test(msgish);
        expect(looksGone, 'object is reported missing').to.be.true;
        return true;
      });
    });
  }
}
