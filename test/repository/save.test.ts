import * as chai from "chai";
import { ChangeEnum } from "../../src/models/change.enum";
import { Repository } from "../../src/repository/repository.class";
import { Sample } from "../sample";

const expect = chai.expect;
let repository: Repository<Sample>;
const data: Sample = { name: 'Name', age: 20 };

describe('Save Repository', () => {
    beforeEach(async () => {
        repository = await Repository.create<Sample>('Sample', {...data});
    });

    afterEach(async () => {
        await repository.delete();
    });

    it('should be able to save changes in the repository data', async() => {   
        repository.board = { ...repository.board, age: 19 } as Sample;
        await repository.save();       
        expect(repository.data).to.deep.include({
            age: 19
        });
    });

    it('should be able to save changes in the repository nested data', async() => {   
        repository.board = { ...repository.board, data: { a: 6 } } as Sample;
        await repository.save();   
        repository.board = { ...repository.board, data: { a: 3, b: 5 } } as Sample;
        await repository.save();       
        expect(repository.data).to.deep.include({
            data: { a: 3, b: 5 }
        });
    });

    it('should reflect changes in repository changes list', async() => {   
        repository.board = { ...repository.board, age: 19 } as Sample;
        await repository.save();               
        expect(repository.changes[0]).to.deep.includes({ path: [ 'age' ], type: ChangeEnum.MUTATED, before: 20, after: 19 });
    });

    it('should save nothing when no changes were made', async() => {   
        await repository.save();               
        expect(repository.changes.length).to.equal(0);
    });
});