import { expect } from 'chai'
import { spy, stub, assert } from 'sinon'
import $ from 'jquery'

import FoodsHandler from '../../lib/foods/foodsHandler'

window.alert = () => {} // omigod stop!!!

const handler = () => new FoodsHandler()
const buildFood = () => ({
  id: 'unlikely',
  name: 'to be a',
  calories: 'coincidence',
})


describe('FoodsHandler', () => {
  beforeEach(() => {
    stub(window, 'fetch')
  })
  afterEach(() => {
    window.fetch.restore()
  })

  describe('#constructor', () => {
    it('needs no arguments', () => {
      expect(handler()).to.be.ok
    })

    it('makes no API calls... yet', () => {
      handler()
      assert.notCalled(window.fetch)
    })
  })

  describe('instance methods', () => {

    let h
    beforeEach(() => {
      h = handler()
    })

    describe('#populate', () => {
      it('fetches the foods index with no options', () => {
        stub(h.service, 'index').resolves([])
        h.populate()
        assert.calledOnce(h.service.index)
        expect(h.service.index.callCount).to.equal(1)
      })
    })

    describe('#listen', () => {
      it('listens')
    })

    describe('#restoreData', () => {
      it("displays a given element and alerts the user", () => {
        const $tr = $('<tr><td>text</td></tr>')
        spy($tr, 'show')
        spy(window, 'alert')
        h.restoreData($tr)
        assert.calledOnce($tr.show)
        assert.calledOnce(window.alert)
        window.alert.restore()
      })
    })

    describe('#renderFood', () => {
      it("returns HTML preserving a given food's id, name, and calories", () => {
        const food = buildFood()
        const rendered = h.renderFood(food)
        expect(rendered).to
              .include(food.id)
          .and.include(food.name)
          .and.include(food.calories)
      })
    })

    describe('#prependFood', () => {
      it("prepends to the data element", () => {
        spy(h.$.data, 'prepend')
        h.prependFood(buildFood())
        assert.calledOnce(h.$.data.prepend)
      })
    })

    describe('#handleClickDelete', () => {
      let tr, event
      beforeEach(() => {
        tr = document.createElement('tr')
        event = { currentTarget: { closest: () => tr }}
        stub(h.service, 'destroy').resolves()
      })
      it("calls the API to delete a food", () => {
        h.handleClickDelete(event)
        assert.calledOnce(h.service.destroy)
      })
      it("hides the containing table row if API fetch resolves", done => {
        h.handleClickDelete(event)
        setImmediate(() => {
          expect($(tr).css('display')).to.equal('none')
          done()
        })
      })
      it("hides the containing table row if API fetch resolves", done => {
        h.handleClickDelete(event)
        setImmediate(() => {
          expect($(tr).css('display')).to.equal('none')
          done()
        })
      })
      it("restores table row if API fetch rejects", done => {
        expect($(tr).css('display')).to.equal('')
        h.service.destroy.rejects()
        h.handleClickDelete(event)
        setImmediate(() => {
          expect($(tr).css('display')).to.equal('')
          done()
        })
      })
    })

    // handleClickDelete(event) {
    //   const $tr = $(event.currentTarget.closest('tr'))
    //   $tr.hide()
    //   this.service.destroy($tr.data('id'))
    //     .then(() => $tr.remove())
    //     .catch(this.restoreData($tr))
    // }

    describe('#sortById', () => {
      it('returns a list sorted by id', () => {
        const actual = handler().sortById([{id:3}, {id:1}, {id:2}])
        expect(actual).to.deep.equal([{id:1}, {id:2}, {id:3}])
      })
    })

    describe('#grabElements', () => {
      it('returns an object of jQuery elements', () => {
        const $els = handler().grabElements();
        [
          'body',
          'addFood',
          'data',
          'errors',
          'inputs.name',
          'inputs.calories',
          'inputs.filter',
        ].forEach(name => {
          // check it's jQuery version, can't really be a coincidence
          expect($els).to.have.nested.property(`${name}.jquery`, $.fn.jquery)
        })
      })
    })

  }) //end of instance methods
})
