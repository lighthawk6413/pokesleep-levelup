import React, { Component, ChangeEvent, FocusEvent } from 'react';
import './Counter.css';
import levelData600Json from '../assets/expTable_600.json';
import levelData900Json from '../assets/expTable_900.json';
import levelData1080Json from '../assets/expTable_1080.json';
import levelData1320Json from '../assets/expTable_1320.json';

// Define the type for each row in the JSON files
interface LevelDataRow {
  currentLevel: string;
  requiedExp: string; // Note: spelling kept consistent with JSON file
  costDreamShards: string;
}

// Define the type for processed level data items
interface LevelDataItem {
  requiredExp: number;
  cost: number;
}

// Define the structure of our component state
interface LevelUpCounterState {
  count: number;
  selectedExpTable: '600' | '900' | '1080' | '1320';
  selectedItemExpOption: 'None' | 'Boost' | 'Reduction';
  // Numeric inputs are stored as strings for editing purposes
  startLevel: string;
  initialRemainingExp: string;
  expBoostRate: string;      // EXP Boost Rate (multiplier)
  depletionRate: string;     // Dream Shards Depletion Rate (multiplier)
  targetLevel: string;       // Target Level
}

type ButtonAction = (value: number) => void;

class LevelUpCounter extends Component<{}, LevelUpCounterState> {
  // Processed level data for different EXP tables
  private levelData600: Record<number, LevelDataItem>;
  private levelData900: Record<number, LevelDataItem>;
  private levelData1080: Record<number, LevelDataItem>;
  private levelData1320: Record<number, LevelDataItem>;

  // Timers for continuous button actions (using number type in browsers)
  private timer: number | null = null;
  private delayTimer: number | null = null;

  constructor(props: {}) {
    super(props);

    // Parse JSON data and convert numeric strings (remove commas)
    this.levelData600 = (levelData600Json as LevelDataRow[]).reduce((acc, item) => {
      const level = Number(item.currentLevel);
      acc[level] = {
        requiredExp: Number(item.requiedExp.replace(/,/g, '')),
        cost: Number(item.costDreamShards.replace(/,/g, ''))
      };
      return acc;
    }, {} as Record<number, LevelDataItem>);

    this.levelData900 = (levelData900Json as LevelDataRow[]).reduce((acc, item) => {
      const level = Number(item.currentLevel);
      acc[level] = {
        requiredExp: Number(item.requiedExp.replace(/,/g, '')),
        cost: Number(item.costDreamShards.replace(/,/g, ''))
      };
      return acc;
    }, {} as Record<number, LevelDataItem>);

    this.levelData1080 = (levelData1080Json as LevelDataRow[]).reduce((acc, item) => {
      const level = Number(item.currentLevel);
      acc[level] = {
        requiredExp: Number(item.requiedExp.replace(/,/g, '')),
        cost: Number(item.costDreamShards.replace(/,/g, ''))
      };
      return acc;
    }, {} as Record<number, LevelDataItem>);

    this.levelData1320 = (levelData1320Json as LevelDataRow[]).reduce((acc, item) => {
      const level = Number(item.currentLevel);
      acc[level] = {
        requiredExp: Number(item.requiedExp.replace(/,/g, '')),
        cost: Number(item.costDreamShards.replace(/,/g, ''))
      };
      return acc;
    }, {} as Record<number, LevelDataItem>);

    // Default settings
    const defaultExpTable: '600' = '600';
    const defaultLevelData = this.levelData600;
    const defaultStartLevel = "1";
    const defaultInitialRemainingExp = String(defaultLevelData[1].requiredExp);

    this.state = {
      count: 0,
      selectedExpTable: defaultExpTable, // '600', '900', '1080', or '1320'
      selectedItemExpOption: 'None',     // 'None', 'Boost', or 'Reduction'
      startLevel: defaultStartLevel,
      initialRemainingExp: defaultInitialRemainingExp,
      expBoostRate: "1",        // EXP Boost Rate (multiplier)
      depletionRate: "1",       // Dream Shards Depletion Rate (multiplier)
      targetLevel: String(Number(defaultStartLevel) + 1)  // Target Level
    };
  }

  // Helper: get numeric values from state
  getNumericStartLevel = (): number => Number(this.state.startLevel);
  getNumericInitialRemainingExp = (): number => Number(this.state.initialRemainingExp);
  getNumericExpBoostRate = (): number => Number(this.state.expBoostRate);
  getNumericDepletionRate = (): number => Number(this.state.depletionRate);
  getNumericTargetLevel = (): number => Number(this.state.targetLevel);

  // Return level data based on the selected EXP table
  getSelectedLevelData = (): Record<number, LevelDataItem> => {
    const { selectedExpTable } = this.state;
    switch (selectedExpTable) {
      case '600': return this.levelData600;
      case '900': return this.levelData900;
      case '1080': return this.levelData1080;
      case '1320': return this.levelData1320;
      default: return this.levelData600;
    }
  };

  // Calculate effective item EXP (base EXP * boost rate)
  getItemExp = (): number => {
    const { selectedItemExpOption } = this.state;
    const expBoostRate = this.getNumericExpBoostRate();
    let baseExp = 25;
    if (selectedItemExpOption === 'Boost') {
      baseExp = 30;
    } else if (selectedItemExpOption === 'Reduction') {
      baseExp = 21;
    }
    return baseExp * expBoostRate;
  };

  // Handler: EXP table change
  handleExpTableChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newTable = e.target.value as '600' | '900' | '1080' | '1320';
    const levelData = newTable === '600'
      ? this.levelData600
      : newTable === '900'
      ? this.levelData900
      : newTable === '1080'
      ? this.levelData1080
      : this.levelData1320;
    // When EXP table changes, update initialRemainingExp based on current startLevel
    const numericLevel = this.getNumericStartLevel();
    const newInitialRemainingExp = levelData[numericLevel]
      ? String(levelData[numericLevel].requiredExp)
      : "0";
    this.setState({
      selectedExpTable: newTable,
      initialRemainingExp: newInitialRemainingExp
    });
  };

  // Handler: Item EXP option change
  handleItemExpChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ selectedItemExpOption: e.target.value as 'None' | 'Boost' | 'Reduction' });
  };

  // Handler: EXP Boost Rate change
  handleExpBoostRateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Update input value without validation here
    this.setState({ expBoostRate: e.target.value });
  };

  // Handler: EXP Boost Rate blur
  handleExpBoostRateBlur = (e: FocusEvent<HTMLInputElement>): void => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    this.setState({ expBoostRate: String(val) });
  };

  // Handler: Depletion Rate change
  handleDepletionRateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ depletionRate: e.target.value });
  };

  // Handler: Depletion Rate blur
  handleDepletionRateBlur = (e: FocusEvent<HTMLInputElement>): void => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    this.setState({ depletionRate: String(val) });
  };

  // Immediate update: when the user changes the Start Level,
  // update the Initial Remaining EXP to the required EXP of the new level,
  // and if the current Target Level is less than or equal to the new Start Level,
  // update Target Level to Start Level + 1.
  handleStartLevelChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newStartLevelStr = e.target.value;
    const parsedLevel = Number(newStartLevelStr);
    const levelData = this.getSelectedLevelData();
    let newInitialRemainingExp = this.state.initialRemainingExp;
    let newTargetLevel = this.state.targetLevel;
    if (!isNaN(parsedLevel) && parsedLevel >= 1 && levelData[parsedLevel]) {
      newInitialRemainingExp = String(levelData[parsedLevel].requiredExp);
      if (Number(this.state.targetLevel) <= parsedLevel) {
        newTargetLevel = String(parsedLevel + 1);
      }
    }
    this.setState({
      startLevel: newStartLevelStr,
      initialRemainingExp: newInitialRemainingExp,
      targetLevel: newTargetLevel
    });
  };

  // Handler: Initial Remaining EXP change
  handleInitialRemainingExpChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ initialRemainingExp: e.target.value });
  };

  // Handler: Initial Remaining EXP blur (final validation)
  handleInitialRemainingExpBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const levelData = this.getSelectedLevelData();
    const currentLevel = Number(this.state.startLevel);
    const maxExp = levelData[currentLevel] ? levelData[currentLevel].requiredExp : 0;
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > maxExp) val = maxExp;
    this.setState({ initialRemainingExp: String(val) });
  };

  // Handler: Target Level change
  handleTargetLevelChange = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ targetLevel: e.target.value });
  };

  // Handler: Target Level blur
  handleTargetLevelBlur = (e: FocusEvent<HTMLInputElement>): void => {
    const levelData = this.getSelectedLevelData();
    const maxLevel = Math.max(...Object.keys(levelData).map(Number));
    let val = Number(e.target.value);
    const minTarget = Number(this.state.startLevel) + 1;
    if (isNaN(val) || val < minTarget) val = minTarget;
    if (val > maxLevel + 1) val = maxLevel + 1;
    this.setState({ targetLevel: String(val) });
  };

  // When Calculate button is pressed, update count to minimal count required for target level
  handleCalculateTarget = (): void => {
    const targetLevel = this.getNumericTargetLevel();
    const minCount = this.computeMinCountForTarget(targetLevel);
    this.setState({ count: minCount });
  };

  // Binary search: compute minimal count required to reach at least target level
  computeMinCountForTarget = (targetLevel: number): number => {
    let low = 0;
    let high = this.computeMaxCountAllowed();
    let answer = high + 1;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      let outcome = this.computeOutcome(mid);
      if (outcome.finalLevel >= targetLevel) {
        answer = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    return answer;
  };

  // Simulate level progression using block processing
  computeOutcome = (itemCount: number): { finalLevel: number; remainingExp: number; totalCost: number; processedCount: number } => {
    const levelData = this.getSelectedLevelData();
    let currentLevel = Number(this.state.startLevel);
    let remainingExp = Number(this.state.initialRemainingExp);
    let totalCost = 0;
    let processedCount = 0;
    let itemsLeft = itemCount;
    const E = this.getItemExp();

    while (itemsLeft > 0 && levelData[currentLevel]) {
      if (itemsLeft * E < remainingExp) {
        totalCost += levelData[currentLevel].cost * itemsLeft;
        remainingExp -= itemsLeft * E;
        processedCount += itemsLeft;
        itemsLeft = 0;
      } else {
        const itemsToLevel = Math.ceil(remainingExp / E);
        totalCost += levelData[currentLevel].cost * itemsToLevel;
        processedCount += itemsToLevel;
        itemsLeft -= itemsToLevel;
        const totalExpFromBlock = itemsToLevel * E;
        let leftover = totalExpFromBlock - remainingExp;
        currentLevel++;
        if (!levelData[currentLevel]) {
          remainingExp = 0;
          break;
        }
        remainingExp = levelData[currentLevel].requiredExp;
        while (leftover > 0 && levelData[currentLevel]) {
          if (leftover >= remainingExp) {
            leftover -= remainingExp;
            currentLevel++;
            if (!levelData[currentLevel]) {
              remainingExp = 0;
              break;
            }
            remainingExp = levelData[currentLevel].requiredExp;
          } else {
            remainingExp -= leftover;
            leftover = 0;
          }
        }
      }
    }
    return { finalLevel: currentLevel, remainingExp, totalCost, processedCount };
  };

  // Compute maximum allowed item count
  computeMaxCountAllowed = (): number => {
    const levelData = this.getSelectedLevelData();
    let currentLevel = Number(this.state.startLevel);
    let remainingExp = Number(this.state.initialRemainingExp);
    let count = 0;
    const E = this.getItemExp();
    while (levelData[currentLevel]) {
      const itemsToLevel = Math.ceil(remainingExp / E);
      count += itemsToLevel;
      const totalExpFromBlock = itemsToLevel * E;
      let leftover = totalExpFromBlock - remainingExp;
      currentLevel++;
      if (!levelData[currentLevel]) break;
      remainingExp = levelData[currentLevel].requiredExp;
      while (leftover > 0 && levelData[currentLevel]) {
        if (leftover >= remainingExp) {
          leftover -= remainingExp;
          currentLevel++;
          if (!levelData[currentLevel]) break;
          remainingExp = levelData[currentLevel].requiredExp;
        } else {
          remainingExp -= leftover;
          leftover = 0;
        }
      }
    }
    return count;
  };

  // Update count with clamping
  add = (value: number): void => {
    if (value > 0) {
      const maxAllowed = this.computeMaxCountAllowed();
      if (this.state.count >= maxAllowed) return;
      if (this.state.count + value > maxAllowed) {
        value = maxAllowed - this.state.count;
      }
    } else {
      if (this.state.count <= 0) return;
      if (this.state.count + value < 0) {
        value = -this.state.count;
      }
    }
    this.setState(prevState => ({ count: prevState.count + value }));
  };

  // Reset count only
  rezero = (): void => {
    this.setState({ count: 0 });
  };

  // Reset all settings to default values
  handleResetAll = (): void => {
    this.setState({
      count: 0,
      selectedExpTable: '600',
      selectedItemExpOption: 'None',
      startLevel: "1",
      initialRemainingExp: String(this.levelData600[1].requiredExp),
      expBoostRate: "1",
      depletionRate: "1",
      targetLevel: "2"
    });
  };

  // Continuous action for button press
  startContinuousAction = (action: ButtonAction, value: number): void => {
    this.stopContinuousAction();
    // Immediate action on press
    action(value);
    // Start continuous action after 500ms if still pressed
    this.delayTimer = window.setTimeout(() => {
      this.timer = window.setInterval(() => action(value), 100);
    }, 500);
  };

  stopContinuousAction = (): void => {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  // Returns button event handlers for continuous actions using pointer events
  getButtonHandlers = (action: ButtonAction, value: number): React.HTMLAttributes<HTMLButtonElement> => ({
    onPointerDown: (e) => {
      e.preventDefault();
      this.startContinuousAction(action, value);
    },
    onPointerUp: (e) => {
      e.preventDefault();
      this.stopContinuousAction();
    },
    onPointerCancel: (e) => {
      e.preventDefault();
      this.stopContinuousAction();
    },
    onPointerLeave: (e) => {
      e.preventDefault();
      this.stopContinuousAction();
    },
    onClick: (e) => {
      // Prevent synthetic click events that might fire after pointer events
      e.preventDefault();
    }
  });

  render() {
    const outcome = this.computeOutcome(this.state.count);
    const maxAllowed = this.computeMaxCountAllowed();
    const disableSubtraction = this.state.count <= 0;
    const disableAddition = this.state.count >= maxAllowed;
    const levelData = this.getSelectedLevelData();
    const maxLevel = Math.max(...Object.keys(levelData).map(Number));
    const currentLevelRequiredExp = levelData[this.getNumericStartLevel()]
      ? levelData[this.getNumericStartLevel()].requiredExp
      : '';
    // Calculate progress for current level's EXP bar
    const currentLevel = outcome.finalLevel;
    const requiredExpForCurrent = levelData[currentLevel]
      ? levelData[currentLevel].requiredExp
      : 1;
    const progressExp = requiredExpForCurrent - outcome.remainingExp;
    const progressPercentage = Math.min((progressExp / requiredExpForCurrent) * 100, 100);

    return (
      <div className="counter-container">
        <div className="setting-group">
          <div className="setting-section">
            {/* Species (EXP Table) */}
            <span className="setting-label">Species (EXP Table): </span>
            <label>
              <input type="radio" name="expTable" value="600" checked={this.state.selectedExpTable === '600'} onChange={this.handleExpTableChange} />
              Common
            </label>
            <label>
              <input type="radio" name="expTable" value="900" checked={this.state.selectedExpTable === '900'} onChange={this.handleExpTableChange} />
              Pseudo-legendary (x1.5)
            </label>
            <label>
              <input type="radio" name="expTable" value="1080" checked={this.state.selectedExpTable === '1080'} onChange={this.handleExpTableChange} />
              Legendary (x1.8)
            </label>
            <label>
              <input type="radio" name="expTable" value="1320" checked={this.state.selectedExpTable === '1320'} onChange={this.handleExpTableChange} />
              Mythical (x2.2)
            </label>
          </div>
          <div className="setting-section">
            {/* Natures (EXP Gains) */}
            <span className="setting-label">Natures (EXP Gains): </span>
            <label>
              <input type="radio" name="itemExp" value="None" checked={this.state.selectedItemExpOption === 'None'} onChange={this.handleItemExpChange} />
              None
            </label>
            <label>
              <input type="radio" name="itemExp" value="Boost" checked={this.state.selectedItemExpOption === 'Boost'} onChange={this.handleItemExpChange} />
              Boost (+18%)
            </label>
            <label>
              <input type="radio" name="itemExp" value="Reduction" checked={this.state.selectedItemExpOption === 'Reduction'} onChange={this.handleItemExpChange} />
              Reduction (-18%)
            </label>
          </div>
          <div className="setting-section">
            <label>
              Start Level:
              {/* Immediate update on change (onBlur removed) */}
              <input
                type="number"
                value={this.state.startLevel}
                min="1"
                max={maxLevel}
                onChange={this.handleStartLevelChange}
                onFocus={(e) => e.target.select()}
              />
            </label>
            <label>
              Initial Remaining EXP:
              <input
                type="number"
                value={this.state.initialRemainingExp}
                min="1"
                max={currentLevelRequiredExp as number | string}
                onChange={this.handleInitialRemainingExpChange}
                onBlur={this.handleInitialRemainingExpBlur}
                onFocus={(e) => e.target.select()}
              />
            </label>
          </div>
          <div className="setting-section">
            <label>
              EXP Boost Rate:
              <input
                type="number"
                value={this.state.expBoostRate}
                min="1"
                max="10"
                onChange={this.handleExpBoostRateChange}
                onBlur={this.handleExpBoostRateBlur}
                onFocus={(e) => e.target.select()}
              />
            </label>
            <label>
              Dream Shards Depletion Rate:
              <input
                type="number"
                value={this.state.depletionRate}
                min="1"
                max="10"
                onChange={this.handleDepletionRateChange}
                onBlur={this.handleDepletionRateBlur}
                onFocus={(e) => e.target.select()}
              />
            </label>
          </div>
          <div className="setting-section">
            <label>
              Target Level:
              <input
                type="number"
                value={this.state.targetLevel}
                min={Number(this.state.startLevel) + 1}
                max={maxLevel + 1}
                onChange={this.handleTargetLevelChange}
                onBlur={this.handleTargetLevelBlur}
                onFocus={(e) => e.target.select()}
              />
            </label>
            <button onClick={this.handleCalculateTarget}>Calculate</button>
          </div>
        </div>
        <div className="result-section">
          <h2>
            Lv. {this.state.startLevel} → Lv. {outcome.finalLevel}
          </h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          <p>Until next level: {outcome.remainingExp.toLocaleString()} EXP</p>
          <p>Candies Used: {this.state.count.toLocaleString()}</p>
          <p>
            Required Dream Shards: {(outcome.totalCost * this.getNumericDepletionRate()).toLocaleString()}
          </p>
          <div className="button-group">
            <button disabled={disableSubtraction} {...this.getButtonHandlers(this.add, -10)}>
              -10
            </button>
            <button disabled={disableSubtraction} {...this.getButtonHandlers(this.add, -1)}>
              -
            </button>
            <button disabled={disableSubtraction} onClick={this.rezero}>
              0
            </button>
            <button disabled={disableAddition} {...this.getButtonHandlers(this.add, 1)}>
              +
            </button>
            <button disabled={disableAddition} {...this.getButtonHandlers(this.add, 10)}>
              +10
            </button>
          </div>
          <div className="reset-group">
            <button onClick={this.handleResetAll}>Reset</button>
          </div>
        </div>
      </div>
    );
  }
}

export default LevelUpCounter;
