import React, { useState, useEffect } from 'react';
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, LabelSeries, Hint } from 'react-vis';
import styled from 'styled-components';

export default function SurveyPlot(props) {
  const { response } = props;
  const [toolTip, setToolTip] = useState('');
  const [chartBars, setChartBars] = useState(null);

  useEffect(() => {
    generateBars();
  }, []);

  const rememberValue = (answer, count) => {
    setToolTip({
      answer,
      count
    });
  };

  const generateBars = () => {
    let arrayOfBars = [];
    console.log('the view results renders for ever');
    response.chartResponse.forEach(question => {
      for (let option in question) {
        arrayOfBars.push((
          <VerticalBarSeries
            key={option}
            data={[question[option]]}
            onSeriesMouseOver={() => {
              rememberValue(option, question[option].y);
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
      {toolTip ? <Hint value={toolTip} /> : null}
    </PlotContainer>
  );
}

const PlotContainer = styled(XYPlot)`
  position: relative;
  margin: 0 auto;
`;
