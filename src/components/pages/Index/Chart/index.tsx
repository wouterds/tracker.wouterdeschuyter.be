import axios from 'axios';
import maxBy from 'lodash/maxBy';
import meanBy from 'lodash/meanBy';
import minBy from 'lodash/minBy';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import CustomTooltip from '../Tooltip';
import { Chart, ChartContent, ChartFooter, LastValue } from './styles';

interface Props {
  sensor: string;
  unit: string;
  color: string;
  syncId?: string;
}

export default (props: Props) => {
  const { sensor, unit, color, syncId } = props;
  const [data, setData] = useState<Array<{ average: number }>>([]);
  const [lastValue, setLastValue] = useState<number | null>(null);

  useEffect(() => {
    try {
      (async () => {
        const { data: response } = await axios.get(
          `${process.env.WEB_API_ENDPOINT}/measurements?sensor=${sensor}&groupByMinutes=10`,
        );

        setData(response);
      })().catch();
    } catch (e) {
      // silent catch error
    }

    const interval = setInterval(() => {
      try {
        (async () => {
          const { data: response } = await axios.get(
            `${process.env.WEB_API_ENDPOINT}/measurements/${sensor}/last`,
          );

          setLastValue(response.value);
        })().catch();
      } catch (e) {
        // silent catch error
      }
    }, 30000);

    return clearInterval(interval);
  }, [true]);

  const high = maxBy(data, 'average');
  const average = meanBy(data, 'average') || null;
  const low = minBy(data, 'average');
  const last = data ? data[data.length - 1] : null;

  return (
    <Chart>
      <ChartContent>
        {lastValue && (
          <LastValue>
            {lastValue}
            <span>{unit}</span>
          </LastValue>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={768}
            height={300}
            data={data}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            syncId={syncId}
          >
            <Line
              type="monotone"
              dataKey="average"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
            <YAxis domain={['auto', 'auto']} hide={true} />
            <Tooltip
              cursor={false}
              content={(tooltipProps: any) => (
                <CustomTooltip {...tooltipProps} unit={unit} name={name} />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContent>
      <ChartFooter>
        <li>
          <label>Low</label>
          <span>
            {low ? (
              <>
                {low.average.toFixed(2)}
                <span>{unit}</span>
              </>
            ) : (
              '--'
            )}
          </span>
        </li>
        <li>
          <label>High</label>
          <span>
            {high ? (
              <>
                {high.average.toFixed(2)}
                <span>{unit}</span>
              </>
            ) : (
              '--'
            )}
          </span>
        </li>
        <li>
          <label>Average</label>
          <span>
            {average ? (
              <>
                {average.toFixed(2)}
                <span>{unit}</span>
              </>
            ) : (
              '--'
            )}
          </span>
        </li>
        <li>
          <label>Last</label>
          <span>
            {last ? (
              <>
                {last.average.toFixed(2)}
                <span>{unit}</span>
              </>
            ) : (
              '--'
            )}
          </span>
        </li>
      </ChartFooter>
    </Chart>
  );
};
