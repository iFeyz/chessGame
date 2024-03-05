import { PieceType , TeamType , Piece , Position, samePosition } from "../Constants";


export default class Referee{

    tileIsEmptyOrOccupiedByOpponnent(position : Position , boardState : Piece[], team : TeamType){
        return !this.tileIsOccupied(position, boardState) || this.TileIsOccupiedByOpponent(position, boardState,team)
    }

    tileIsOccupied(position : Position,boardState: Piece[]):boolean{

        const piece = boardState.find(p=> samePosition(p.position , position))
        if(piece){
            return true;
        } else {
            return false;
        }
    }

    TileIsOccupiedByOpponent(position : Position , boardState : Piece[], team : TeamType): boolean{

        const piece = boardState.find((p)=> samePosition(p.position, position));
         
        if(piece){
            return true
        } else {
            return false
        }
    }

    isEnPassantMove(initialPosition : Position,desiredPosition : Position, type : PieceType, team: TeamType ,boardState: Piece[] ){
        const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

        if(type === PieceType.PAWN){
            if((desiredPosition.x-initialPosition.x === -1 || desiredPosition.x-initialPosition.x ===1 )&& desiredPosition.y - initialPosition.y === pawnDirection){
                const piece = boardState.find(
                    (p)=> p.position.x === desiredPosition.x && p.position.y === desiredPosition.y - pawnDirection && p.enPassant
                );
                if(piece){
                    return true;                   
                }
            }
        } 


        return false
    }

    isValidMove(initialPosition : Position,desiredPosition : Position, type: PieceType, team:TeamType,boardState: Piece[]){

        //PAWN ACTION 
        if(type === PieceType.PAWN){
            const specialRow = (team === TeamType.OUR) ? 1 : 6;
            const pawnDirection = (team === TeamType.OUR) ? 1 : -1;

            //Movement logic
            if(initialPosition.x === desiredPosition.x && initialPosition.y === specialRow && desiredPosition.y-initialPosition.y === 2 * pawnDirection){
                if(
                    !this.tileIsOccupied(desiredPosition,boardState)&&
                    !this.tileIsOccupied({x: desiredPosition.x, y : desiredPosition.y - pawnDirection },boardState)
                ){
                    return true;
                }
            } else if(initialPosition.x === desiredPosition.x && desiredPosition.y -initialPosition.y === pawnDirection) {
                if(!this.tileIsOccupied(desiredPosition, boardState)){
                    return true;
                }
            }
            //Attack logic
            else if(desiredPosition.x -initialPosition.x === -1 && desiredPosition.y - initialPosition.y === pawnDirection){
                //Attack in upper or bottom left corner
                if(this.TileIsOccupiedByOpponent(desiredPosition,boardState,team)){
                    console.log("upper /bottom left")
                    return true;
                }

            } else if (desiredPosition.x-initialPosition.x === 1 && desiredPosition.y-initialPosition.y === pawnDirection){
                //Attack in upper or bottom right corner
                if(this.TileIsOccupiedByOpponent(desiredPosition,boardState,team)){
                    console.log("upper / bottom right")
                    return true;
                }
            }
        } 
        //KNIGHT ACTION
        else if(type === PieceType.KNIGHT) {
            console.log("KNIGHT TEST")
            // 8 different logic moving patterns
            for(let i = -1 ; i < 2; i+=2){
                for(let j = -1; j < 2 ; j +=2){
                //TOP SIDE MOVEMENT
                if(desiredPosition.y - initialPosition.y === 2 * i){
                        if(desiredPosition.x - initialPosition.x === j){
                            if(this.tileIsEmptyOrOccupiedByOpponnent(desiredPosition,boardState,team)){
                                return true
                            }
                            console.log('upper/bottom left movement')                   
                        }
                }
                //BOTTOM SIDE MOVEMENT
                if(desiredPosition.x - initialPosition.x === 2 * i ){
                    if(desiredPosition.y - initialPosition.y === j){
                        if(this.tileIsEmptyOrOccupiedByOpponnent(desiredPosition,boardState,team)){
                            return true
                        }
                        console.log("Righ/left bottom movement")
                    } 
                }   
                }            
            }
        }
        //BISHOP MOVEMENT 

        else if (type === PieceType.BISHOP){
            for(let i = 1 ; i < 8 ; i++){
                //
                if(desiredPosition.x > initialPosition.x && desiredPosition.y > initialPosition.y){
                    let passedPosition : Position = { x : initialPosition.x + i , y: initialPosition.y + i}
                    if(this.tileIsOccupied(passedPosition,boardState)){
                        break;     
                    }
                }
                if(desiredPosition.x - initialPosition.x === i && desiredPosition.y - initialPosition.y === i){
                    return true;
                }
                //
                if(desiredPosition.x > initialPosition.x && desiredPosition.y < initialPosition.y ){
                    let passedPosition : Position = { x : initialPosition.x + i, y: initialPosition.y - i}
                    if(this.tileIsOccupied(passedPosition,boardState)){
                        break;
                    }
                }
                if(desiredPosition.x - initialPosition.x === i && desiredPosition.y - initialPosition.y === -i){
                    return true
                }
                //
                if(desiredPosition.x < initialPosition.x && desiredPosition.y < initialPosition.y ){
                    let passedPosition : Position = { x : initialPosition.x - i, y: initialPosition.y - i}
                    if(this.tileIsOccupied(passedPosition,boardState)){
                        break;
                    }
                }                
                if(desiredPosition.x - initialPosition.x === -i && desiredPosition.y - initialPosition.y === -i){
                    return true;
                }
                //
                if(desiredPosition.x < initialPosition.x && desiredPosition.y > initialPosition.y ){
                    let passedPosition : Position = { x : initialPosition.x - i, y: initialPosition.y + i}
                    if(this.tileIsOccupied(passedPosition,boardState)){
                        break;
                    }
                }                
                if(desiredPosition.x - initialPosition.x === -i && desiredPosition.y - initialPosition.y === i){
                    return true;
                }
            }
        }
        return false;
    }

}