import React, { useState, useMemo, useCallback, useRef, ChangeEvent, FocusEvent } from 'react';
import './Counter.css';
import levelData600Json from '../assets/expTable_600.json';
import levelData900Json from '../assets/expTable_900.json';
import levelData1080Json from '../assets/expTable_1080.json';
import levelData1320Json from '../assets/expTable_1320.json';

type LevelDataRow = { currentLevel: string; requiedExp: string; costDreamShards: string };
type LevelDataItem = { requiredExp: number; cost: number };

const parseLevelData = (rows: LevelDataRow[]): Record<number, LevelDataItem> =>
  rows.reduce((acc, { currentLevel, requiedExp, costDreamShards }) => {
    const lvl = Number(currentLevel);
    acc[lvl] = {
      requiredExp: Number(requiedExp.replace(/,/g, '')),
      cost: Number(costDreamShards.replace(/,/g, '')),
    };
    return acc;
  }, {} as Record<number, LevelDataItem>);

const allLevelTables: Record<'600'|'900'|'1080'|'1320', Record<number, LevelDataItem>> = {
  '600': parseLevelData(levelData600Json as LevelDataRow[]),
  '900': parseLevelData(levelData900Json as LevelDataRow[]),
  '1080': parseLevelData(levelData1080Json as LevelDataRow[]),
  '1320': parseLevelData(levelData1320Json as LevelDataRow[]),
};

const LevelUpCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [tableKey, setTableKey] = useState<'600'|'900'|'1080'|'1320'>('600');
  const [itemOption, setItemOption] = useState<'None'|'Boost'|'Reduction'>('None');
  const [startLevel, setStartLevel] = useState('1');
  const [initialRemExp, setInitialRemExp] = useState(String(allLevelTables['600'][1].requiredExp));
  const [expBoostRate, setExpBoostRate] = useState('1');
  const [depletionRate, setDepletionRate] = useState('1');
  const [targetLevel, setTargetLevel] = useState('2');

  const delayRef = useRef<number>();
  const intervalRef = useRef<number>();

  const toNum = (v: string) => Number(v) || 0;
  const lvlStart = toNum(startLevel);
  const remExpStart = toNum(initialRemExp);
  const boostRate = toNum(expBoostRate);
  const depleteRate = toNum(depletionRate);
  const lvlTarget = toNum(targetLevel);

  const levelTable = useMemo(() => allLevelTables[tableKey], [tableKey]);

  const itemExp = useMemo(() => {
    const base = itemOption === 'Boost' ? 30 : itemOption === 'Reduction' ? 21 : 25;
    return base * boostRate;
  }, [itemOption, boostRate]);

  const simulate = useCallback((maxItems: number) => {
    let lvl = lvlStart;
    let rem = remExpStart;
    let totalCost = 0;
    let processed = 0;
    let items = maxItems;
    while (items > 0 && levelTable[lvl]) {
      if (items * itemExp < rem) {
        totalCost += levelTable[lvl].cost * items;
        rem -= items * itemExp;
        processed += items;
        break;
      }
      const needCount = Math.ceil(rem / itemExp);
      totalCost += levelTable[lvl].cost * needCount;
      processed += needCount;
      items -= needCount;
      let overflow = needCount * itemExp - rem;
      lvl++;
      if (!levelTable[lvl]) { rem = 0; break; }
      rem = levelTable[lvl].requiredExp;
      while (overflow > 0 && levelTable[lvl]) {
        if (overflow >= rem) {
          overflow -= rem;
          lvl++;
          if (!levelTable[lvl]) { rem = 0; break; }
          rem = levelTable[lvl].requiredExp;
        } else {
          rem -= overflow;
          overflow = 0;
        }
      }
    }
    return { finalLevel: lvl, remainingExp: rem, totalCost, processedCount: processed };
  }, [lvlStart, remExpStart, levelTable, itemExp]);

  const maxAllowed = useMemo(() => {
    let lvl = lvlStart;
    let rem = remExpStart;
    let total = 0;
    while (levelTable[lvl]) {
      const needCount = Math.ceil(rem / itemExp);
      total += needCount;
      let overflow = needCount * itemExp - rem;
      lvl++;
      if (!levelTable[lvl]) break;
      rem = levelTable[lvl].requiredExp;
      while (overflow > 0 && levelTable[lvl]) {
        if (overflow >= rem) {
          overflow -= rem;
          lvl++;
          if (!levelTable[lvl]) break;
          rem = levelTable[lvl].requiredExp;
        } else {
          rem -= overflow;
          overflow = 0;
        }
      }
    }
    return total;
  }, [lvlStart, remExpStart, levelTable, itemExp]);

  const outcome = useMemo(() => simulate(count), [count, simulate]);

  const clampAndSet = (val: string, setter: React.Dispatch<React.SetStateAction<string>>, min: number, max: number) => {
    let n = toNum(val);
    if (n < min) n = min;
    if (n > max) n = max;
    setter(String(n));
  };

  const handleBlur = (setter: React.Dispatch<React.SetStateAction<string>>, min: number, max: number) =>
    (e: FocusEvent<HTMLInputElement>) => clampAndSet(e.target.value, setter, min, max);

  const handleTableChange = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value as '600'|'900'|'1080'|'1320';
    setTableKey(key);
    const lvl = toNum(startLevel);
    setInitialRemExp(String(allLevelTables[key][lvl]?.requiredExp || 0));
  };

  const handleItemChange = (e: ChangeEvent<HTMLInputElement>) => setItemOption(e.target.value as any);

  const handleStartLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setStartLevel(v);
    const n = toNum(v);
    if (levelTable[n]) {
      setInitialRemExp(String(levelTable[n].requiredExp));
      if (lvlTarget <= n) setTargetLevel(String(n + 1));
    }
  };

  const addCount = useCallback((delta: number) => {
    setCount(prev => Math.min(Math.max(prev + delta, 0), maxAllowed));
  }, [maxAllowed]);

  const calculateTarget = () => {
    let lo = 0, hi = maxAllowed, ans = hi;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi)/2);
      if (simulate(mid).finalLevel >= toNum(targetLevel)) { ans = mid; hi = mid -1; }
      else lo = mid +1;
    }
    setCount(ans);
  };

  const resetAll = () => {
    setCount(0);
    setTableKey('600');
    setItemOption('None');
    setStartLevel('1');
    setInitialRemExp(String(allLevelTables['600'][1].requiredExp));
    setExpBoostRate('1');
    setDepletionRate('1');
    setTargetLevel('2');
  };

  // const startContinuous = (action: () => void, value: number) => {
    // stopContinuous();
    // action();
    // delayRef.current = window.setTimeout(() => {
      // intervalRef.current = window.setInterval(() => action(), 100);
    // }, 500);
  // };
  const stopContinuous = () => {
    if (delayRef.current) clearTimeout(delayRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  const getButtonProps = (action: () => void) => ({
    onPointerDown: (e: any) => { e.preventDefault(); action(); delayRef.current = window.setTimeout(() => intervalRef.current = window.setInterval(action,100),500); },
    onPointerUp: (e: any) => { e.preventDefault(); stopContinuous(); },
    onPointerLeave: (e: any) => { e.preventDefault(); stopContinuous(); },
    onPointerCancel: (e: any) => { e.preventDefault(); stopContinuous(); },
    onClick: (e: any) => e.preventDefault(),
  });

  const maxLevel = Math.max(...Object.keys(levelTable).map(Number));
  const reqExpCurrLvl = levelTable[outcome.finalLevel]?.requiredExp || 1;
  const progExp = reqExpCurrLvl - outcome.remainingExp;
  const progressPct = (progExp / reqExpCurrLvl) * 100;

  return (
    <div className="counter-container">
      <div className="setting-group">
        <div className="setting-section">
          <span className="setting-label">Species (EXP Table): </span>
          {(['600','900','1080','1320'] as const).map(key => (
            <label key={key}>
              <input type="radio" name="expTable" value={key} checked={tableKey===key} onChange={handleTableChange} />
              {key === '600'? 'Common' : key==='900'? 'Pseudo-legendary (x1.5)' : key==='1080'? 'Legendary (x1.8)' : 'Mythical (x2.2)'}
            </label>
          ))}
        </div>
        <div className="setting-section">
          <span className="setting-label">Natures (EXP Gains): </span>
          {(['None','Boost','Reduction'] as const).map(opt => (
            <label key={opt}>
              <input type="radio" name="itemExp" value={opt} checked={itemOption===opt} onChange={handleItemChange} />
              {opt==='None'? 'None' : opt==='Boost'? 'Boost (+18%)' : 'Reduction (-18%)'}
            </label>
          ))}
        </div>
        <div className="setting-section">
          <label>
            Start Level:
            <input type="number" value={startLevel} min="1" max={maxLevel} onChange={handleStartLevelChange} onFocus={e=>e.target.select()} />
          </label>
          <label>
            Initial Remaining EXP:
            <input type="number" value={initialRemExp} min="1" max={reqExpCurrLvl} onChange={e=>setInitialRemExp(e.target.value)} onBlur={handleBlur(setInitialRemExp,1,reqExpCurrLvl)} onFocus={e=>e.target.select()} />
          </label>
        </div>
        <div className="setting-section">
          <label>
            EXP Boost Rate:
            <input type="number" value={expBoostRate} min="1" max="10" onChange={e=>setExpBoostRate(e.target.value)} onBlur={handleBlur(setExpBoostRate,1,10)} onFocus={e=>e.target.select()} />
          </label>
          <label>
            Dream Shards Depletion Rate:
            <input type="number" value={depletionRate} min="1" max="10" onChange={e=>setDepletionRate(e.target.value)} onBlur={handleBlur(setDepletionRate,1,10)} onFocus={e=>e.target.select()} />
          </label>
        </div>
        <div className="setting-section">
          <label>
            Target Level:
            <input type="number" value={targetLevel} min={lvlStart+1} max={maxLevel+1} onChange={e=>setTargetLevel(e.target.value)} onBlur={handleBlur(setTargetLevel,lvlStart+1,maxLevel+1)} onFocus={e=>e.target.select()} />
          </label>
          <button onClick={calculateTarget}>Calculate</button>
        </div>
      </div>
      <div className="result-section">
        <h2>Lv. {startLevel} → Lv. {outcome.finalLevel}</h2>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
        <p>Until next level: {outcome.remainingExp.toLocaleString()} EXP</p>
        <p>Candies Used: {count.toLocaleString()}</p>
        <p>Required Dream Shards: {(outcome.totalCost * depleteRate).toLocaleString()}</p>
        <div className="button-group">
          <button disabled={count<=0} {...getButtonProps(() => addCount(-10))}>-10</button>
          <button disabled={count<=0} {...getButtonProps(() => addCount(-1))}>-</button>
          <button disabled={count<=0} onClick={() => setCount(0)}>0</button>
          <button disabled={count>=maxAllowed} {...getButtonProps(() => addCount(1))}>+</button>
          <button disabled={count>=maxAllowed} {...getButtonProps(() => addCount(10))}>+10</button>
        </div>
        <div className="reset-group">
          <button onClick={resetAll}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpCounter;
