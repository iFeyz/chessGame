import react from 'react';
import './Chessboard.css';
import Tile from './Tile/Tile';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Referee from '../referee/Referee';
import { verticalAxis , horizontalAxis , Piece , PieceType , TeamType , initialBoardState} from '../Constants';


const pieces : Piece[] = [];




export default function Chessboard(){
    const [activePiece,  setActivePiece] = useState<HTMLElement | null> (null);
    const [gridX , setGridX] = useState(0);
    const [gridY , setGridY] = useState(0);
    const [pieces,setPieces] = useState<Piece[]>(initialBoardState)
    const chessboardRef = useRef<HTMLElement>(null);
    const referee = new Referee();

    function grabPiece(e:React.MouseEvent<HTMLDivElement, MouseEvent>){
        const chessboard = chessboardRef.current;
        const element = e.target as HTMLElement;
        if(element.classList.contains("chess-piece") && chessboard){
           // console.log(e);
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop- 800 ) / 100)));
            const x = e.clientX-50;
            const y = e.clientY-50;
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
    
            setActivePiece(element);
        }
    }

    function movePiece(e:React.MouseEvent){
        const chessboard = chessboardRef.current;
        if(activePiece && activePiece.classList.contains("chess-piece") && chessboard){
            const minX = chessboard.offsetLeft-25;
            const minY = chessboard.offsetTop-25;
            const maxX = chessboard.offsetLeft+chessboard.clientWidth-75;
            const maxY = chessboard.offsetTop+chessboard.clientHeight-75;
            const x = e.clientX-50;
            const y = e.clientY-50;
            activePiece.style.position = "absolute";


            if(x<minX){
                activePiece.style.left = `${minX}px`;
            } else if(x>maxX){
                activePiece.style.left = `${maxX}px`;
            } else {
                activePiece.style.left = `${x}px`;
            }

            if(y<minY){
                activePiece.style.top = `${minY}px`;
            }else if(y>maxY) {
                activePiece.style.top = `${maxY}px`;
            } else {
                activePiece.style.top = `${y}px`;
            }
        }
    }
    
    function dropPiece(e:React.MouseEvent){
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const y = Math.abs(Math.floor((e.clientY - chessboard.offsetTop- 700 ) / 100));
            

            const currentPiece = pieces.find(p=> p.position.x === gridX && p.position.y === gridY);
            const attackedPiece = pieces.find(p=> p.position.x === x && p.position.y === y);

            if(currentPiece){
                const validMove = referee.isValidMove(gridX,gridY,x,y,currentPiece?.type,currentPiece?.team, pieces);
                const isEnPassantMove = referee.isEnPassantMove(gridX,gridY,x,y,currentPiece.type,currentPiece.team,pieces)
                const pawnDirection = (currentPiece.team === TeamType.OUR) ? 1 : -1;
                
                if(isEnPassantMove){
                    const updatedPieces = pieces.reduce((results, piece)=>{
                        if(piece.position.x === gridX && piece.position.y === gridY){
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        } else if(!(piece.position.x === x && piece.position.y === y-pawnDirection)){
                            if(piece.type === PieceType.PAWN){
                                piece.enPassant = false;
                            }
                            results.push(piece);                            
                        }
                        return results;
                    },[] as Piece[])

                    setPieces(updatedPieces);
                }
                else if(validMove){

                //Update the piece position 
                const updatedPieces = pieces.reduce((results,piece)=>{
                    if(piece.position.x === gridX && piece.position.y === gridY){
                        if(Math.abs(gridY-y) === 2 && piece.type === PieceType.PAWN){
                            //special moove
                            piece.enPassant = true;
                        } else {
                            piece.enPassant = false;
                        }
                        piece.position.x = x;
                        piece.position.y = y;
                        results.push(piece);
                    } else if(!(piece.position.x === x && piece.position.y === y)){
                        if(piece.type === PieceType.PAWN){
                            piece.enPassant = false;
                        }
                        results.push(piece);
                    }
                    return results;
                },[] as Piece[]);

                setPieces(updatedPieces);
                    
                } else {
                    //Resets the piece position 
                    activePiece.style.position = 'relative';
                    activePiece.style.removeProperty('top');
                    activePiece.style.removeProperty('left');
                }
            }
                setActivePiece(null);
            //je vais test
        }
    }

    let board = [];

        for(let j=verticalAxis.length-1;j>=0;j--){
            for(let i =0;i<horizontalAxis.length;i++){
                const number = j + i + 2

                let image = undefined;

                pieces.forEach((p)=>{
                    if(p.position.x=== i && p.position.y ===j ){
                        image = p.image;
                    }
                });
                board.push(<Tile image={image} number={number}/>)
        }
    }
    return <div 
            onMouseMove={e=>movePiece(e)} 
            onMouseDown={e=>grabPiece(e)}
            onMouseUp={e=>dropPiece(e)}
            id="chessboard"
            ref={chessboardRef as React.RefObject<HTMLDivElement>}>
                {board}
            </div>
}