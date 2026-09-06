import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CellsInterface, MovesInterface, MoveType } from '../../../interface';
import { environment } from '../../../../environments/environment';
import { sortMovesByIdDesc } from '../../../helpers/json.helper';

@Component({
  selector: 'game-moves',
  templateUrl: './moves.component.html',
  styleUrls: ['./moves.component.sass'],
})
export class MovesComponent implements OnInit {
  @Input() moves: MovesInterface[] = [];
  @Input() lastMove: MovesInterface | null = null;
  @Input() cellsData: CellsInterface[] = [];

  @Output() rollTheDice = new EventEmitter<number>();

  showDiceButtons: boolean = true;
  moveDialogShow: boolean = false;

  showMovesDialog = () => {
    this.moves.sort(sortMovesByIdDesc);
    this.moveDialogShow = true;
  };
  rollDice = (dice: number) => this.rollTheDice.emit(dice);

  ngOnInit() {
    if (environment.production) this.showDiceButtons = false;
  }

  moveTypeDescription(moveType: MoveType) {
    return moveType === MoveType.DICE
      ? 'По броску кубику'
      : moveType === MoveType.AUTO
        ? 'Автопереход'
        : 'Ручное передвижение';
  }

  protected readonly MoveType = MoveType;
}
