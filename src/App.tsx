import { useState } from "react";
import "./App.css";

function App() {
  const [distance, setDistance] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        calculateDistance(text);
      };
      reader.readAsText(file);
    }
  };

  const calculateDistance = (input: string) => {
    const lines = input.split("\n");
    const [obstaclesAmount, commandsAmount] = lines[0].split(" ").map((elem) => parseInt(elem, 10));

    const obstacles = [];
    const commands = [];
    let pointer = 1;

    while (obstacles.length < obstaclesAmount) {
      obstacles.push(lines[pointer].split(" ").map((elem) => parseInt(elem, 10)));
      pointer++;
    }

    while (commands.length < commandsAmount) {
      commands.push(lines[pointer].trim().split(" "));
      pointer++;
    }

    // robot's starting point
    const startingPosition: [number, number] = [0, 0];
    let currentPosition: [number, number] = startingPosition;
    let currentDirection = "N"; // N, S, E, W

    // execute robot's commands
    for (const command of commands) {
      if (command.length === 1) {
        // it's a turn
        currentDirection = getNewDirection(currentDirection, command[0]);
      } else if (command.length === 2) {
        // if's a move
        currentPosition = getNewPosition(currentPosition, currentDirection, parseInt(command[1], 10), obstacles);
      }
      console.log(`current: ${currentDirection}  ${currentPosition}`);
    }

    setDistance(getMaxDistance(startingPosition, currentPosition));
  };

  const getNewPosition = (currentPosition, currentDirection, steps, obstacles) => {
    let [x, y] = currentPosition;
    let result = currentPosition;

    for (let i = 0; i < steps; i++) {
      switch (currentDirection) {
        case "N":
          y += 1;
          break;
        case "S":
          y -= 1;
          break;
        case "E":
          x += 1;
          break;
        case "W":
          x -= 1;
          break;
        default:
          break;
      }

      // Check for obstacles
      for (const obstacle of obstacles) {
        if (obstacle[0] === x && obstacle[1] === y) {
          console.log("Obstacle encountered at:", [x, y]);
          return result;
        }
      }

      result = [x, y];
    }

    return result;
  };

  const getNewDirection = (currentDirection, turnCommand) => {
    let newDirection;
    switch (currentDirection) {
      case "N":
        newDirection = turnCommand === "L" ? "W" : "E";
        break;
      case "W":
        newDirection = turnCommand === "L" ? "S" : "N";
        break;
      case "S":
        newDirection = turnCommand === "L" ? "E" : "w";
        break;
      case "E":
        newDirection = turnCommand === "L" ? "N" : "S";
        break;
      default:
        newDirection = currentDirection;
    }

    return newDirection;
  };

  const getMaxDistance = ([x1, y1], [x2, y2]) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)).toFixed(2);
  };

  return (
    <>
      <h1>Coinmerce robot</h1>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <div>
        <h2>Distance: {distance}</h2>
      </div>
    </>
  );
}

export default App;
