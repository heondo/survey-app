import React, { useState, useEffect } from 'react';
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, Hint } from 'react-vis';
import styled from 'styled-components';

export default function SurveyPlot(props) {
  const { response } = props;
  const [toolTip, setToolTip] = useState('');
  const [chartBars, setChartBars] = useState(null);

  useEffect(() => {
    generateBars();
  }, []);

  const rememberValue = (x, y, questionName) => {
    setToolTip({
      x,
      y,
      questionName
    });
  };

  const generateBars = () => {
    let arrayOfBars = [];
    response.chartResponse.forEach(question => {
      for (let option in question) {
        arrayOfBars.push((
          <VerticalBarSeries
            key={option}
            data={[question[option]]}
            onSeriesMouseOver={() => {
              rememberValue(question[option].x, question[option].y, option);
            }}
            onSeriesMouseOut={() =>
              setToolTip(null)}
          />)
        );
      }
    });
    setChartBars(arrayOfBars);
  };

  return (
    <PlotContainer xType="ordinal" width={500} height={500} xDistance={100}>
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
      {chartBars}
      {toolTip ? (
        <Hint value={toolTip} style={{ left: '200px' }}>
          <div style={{ background: 'black', borderRadius: '3px', fontSize: '.85rem', padding: '3px' }}>
            <div>answer: {toolTip.questionName.trim()}</div>
            <div>count: {toolTip.y}</div>
          </div>
        </Hint>
      ) : null}
    </PlotContainer>
  );
}

const PlotContainer = styled(XYPlot)`
  /* position: relative; */
  margin: 0 auto;
`;
