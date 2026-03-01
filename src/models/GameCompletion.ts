import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export interface GameCompletionAttributes {
  id?: number;
  score: number;
  playType: number;
  timestamp: number;
}

interface GameCompletionCreationAttributes extends Optional<GameCompletionAttributes, "id"> {}

class GameCompletion extends Model<GameCompletionAttributes, GameCompletionCreationAttributes> {}

GameCompletion.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    playType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "game_completions",
    timestamps: true,
    indexes: [
      {
        fields: ["timestamp", "playType", "score"],
      },
    ],
  }
);

export default GameCompletion;