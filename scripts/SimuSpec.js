/**
 * Created by Alex on 29.04.2016.
 */
describe( 'CPU', function(){
    var scope = {},
        ctrl = new CPU(scope);
    it('should test DFSZ', function(){
        scope.ram[27]="4f";
        callOperation('BA7');
        expect(scope.ram[27]).toEqual("4e");
    });
});