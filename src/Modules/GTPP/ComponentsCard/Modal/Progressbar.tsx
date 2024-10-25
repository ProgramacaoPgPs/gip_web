import React from 'react';
import { useMyContext } from '../../../../Context/MainContext';

interface ProgressBarProps {
  progressValue: number;
  resetValue?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progressValue }) => {
  const { newProgressBar, setNewProgressBar } = useMyContext();

  // const clampedValue = Math.min(Math.max((newProgressBar ? newProgressBar :progressValue) , 0), 100);
   const clampedValue = Math.min(Math.max((progressValue) , 0), 100);

  const getProgressClass = () => {
    if (clampedValue < 50) return 'bg-danger';
    if (clampedValue < 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="progress mt-2 mx-2">
      <div
        className={`progress-bar ${getProgressClass()}`}
        role="progressbar"
        style={{ width: `${clampedValue}%` }}
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {clampedValue}%
      </div>
    </div>
  );
};

export default ProgressBar;
