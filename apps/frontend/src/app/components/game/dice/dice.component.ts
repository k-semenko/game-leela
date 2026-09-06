import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  MovesInterface,
  MoveType,
  PlayerInterface,
  UserInterface,
} from '../../../interface';
import { fieldAutomaticMoves } from '../../../constants';
import { DiceModalInterface } from '../game-field/dice-modal.interface';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.sass'],
})
export class DiceComponent implements OnInit {
  @Input() dice = 1;
  @Input() playerMovesSequence: number[] = [];
  @Input() showMovesDialog: boolean = false;
  @Input() lastMove: MovesInterface | null = null;
  @Input() selectedPlayer: PlayerInterface | null = null;
  @Input() currentUser: UserInterface | null = null;
  @Input() gameOwnerUser: boolean | null = false;
  @Input() state!: DiceModalInterface;

  @Output() rollDice = new EventEmitter();
  @Output() makeMove = new EventEmitter();
  @Output() changePlayer = new EventEmitter();
  @Output() setNextChipPosition = new EventEmitter<number>();
  @Output() setMoveType = new EventEmitter<MoveType>();
  @Output() diceDialogState = new EventEmitter<DiceModalInterface>();

  ngOnInit() {
    this.dice = 1;
  }

  move = async () => {
    await this.delay();
    this.checkAutoMove();

    if (
      this.playerMovesSequence.length === 1 ||
      (this.playerMovesSequence.length === 0 && this.state.nextStepAuto)
    ) {
      this.state.preview = true;
      this.state.exitDialog = true;
      this.diceDialogState.emit(this.state);
    }

    this.makeMove.emit();
  };

  hidePreview = async () => {
    await this.delay();
    this.checkAutoMove();
    this.state.sixOnStart = false;

    if (this.playerMovesSequence.length === 1) {
      this.state.preview = true;
      this.state.exitDialog = true;
    } else {
      this.state.preview = false;
    }
    this.diceDialogState.emit(this.state);

    this.makeMove.emit();
  };

  checkAutoMove = () => {
    const step =
      this.selectedPlayer?.position! + this.playerMovesSequence.at(0)!;

    this.state.fieldEnd = step > 72;

    const finalCell = fieldAutomaticMoves.find((move) => move.from == step);
    if (finalCell) {
      this.state.nextStepAuto = true;
      this.state.nextStepCell = finalCell?.to;
    }

    this.diceDialogState.emit(this.state);
  };

  changePlayerEmit = async () => {
    await this.delay(250);
    this.state.exitDialog = false;
    this.diceDialogState.emit(this.state);
    this.changePlayer.emit();
  };

  rollTheDice = async () => {
    await this.delay();
    this.rollDice.emit();
  };

  moveAuto = async () => {
    await this.delay(300);
    this.state.nextStepAuto = false;
    this.setMoveType.emit(MoveType.AUTO);
    this.setNextChipPosition.emit(this.state.nextStepCell);
    this.state.nextStepCell = 0;

    this.diceDialogState.emit(this.state);
  };

  delay = async (ms: number = 500) => {
    this.state.showLoader = true;

    await new Promise((f) => {
      setTimeout(f, ms);
    });

    this.state.showLoader = false;
  };
}
