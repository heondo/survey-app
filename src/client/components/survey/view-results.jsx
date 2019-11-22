import React, { useEffect, useState } from 'react';
import LoadingCircle from '../helper/loading-circle';
import { Container } from '@material-ui/core';
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, LabelSeries, Hint } from 'react-vis';
import moment from 'moment';
import styled from 'styled-components';

export default function ViewResults(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [surveyResults, setSurveyResults] = useState({});
  const [chartData, setChartData] = useState({});
  const [responseCount, setResponseCount] = useState({});
  const [answerCounts, setAnswerCounts] = useState([]);
  const [toolTip, setToolTip] = useState(null);

  const rememberValue = (answer, count) => {
    setToolTip({
      answer,
      count
    });
  };

  function generateBars() {
    let arrayOfBars = [];
    console.log('the view results renders for ever');
    chartData.forEach(question => {
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
    return arrayOfBars;
  }

  useEffect(() => {
    getSurveyResults();
  }, [props.match.params.id]);

  const getSurveyResults = () => {
    const token = window.localStorage.getItem('token');
    const surveyID = props.match.params.id;
    fetch(`/api/surveys/results/${surveyID}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          throw new Error(res.error);
        }
        setChartData(res.chartResponse);
        setSurveyResults(res.responses);
        setResponseCount(res.responseCount);
        setAnswerCounts(res.answerCounts);
        setIsLoaded(true);
      })
      .catch(err => console.error(err));
  };

  return isLoaded ? (
    <Container>
      <h4>{surveyResults[0].survey_name}</h4>
      <div>Created {moment(surveyResults[0].survey_date).calendar()}</div>
      <div>With {responseCount} responses so far</div>
      <PlotContainer xType="ordinal" width={500} height={500} xDistance={100}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        {generateBars()}
        {toolTip ? <Hint value={toolTip} /> : null}
      </PlotContainer>
      <div>
        <MultChoice>Multiple Choice Stats</MultChoice>
        {
          answerCounts.map((q, i) => (
            <StatsArray key={i} question={q} responseCount={responseCount}/>
          ))
        }
      </div>
    </Container>
  )
    : <LoadingCircle />;
}

function StatsArray(props) {
  const { question, responseCount } = props;
  const { x: questionName, results } = question;

  useEffect(() => {}, []);

  return (
    <div>
      <QuestionName>
        {questionName}
      </QuestionName>
      <div style={{ display: 'flex' }}>
        <span>
          {Object.keys(results).map((key, i) => {
            return (
              <div key={i}>{key}</div>
            );
          })}
        </span>
        <PercentagesContainer>
          {Object.values(results).map((val, i) => {
            const percent = ((val / responseCount) * 100).toFixed(2);
            const randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
            return (
              <div
                key={i}
                style={{
                  border: '1px solid black',
                  backgroundColor: `${randomColor}`
                }}
              >
                {percent}
              </div>
            );
          })}
        </PercentagesContainer>
        <span>
          {Object.values(results).map((val, i) => {
            return (
              <div key={i}>{val}</div>
            );
          })}
        </span>
      </div>
    </div>
  );
}

const PlotContainer = styled(XYPlot)`
  position: relative;
  margin: 0 auto;
`;

const QuestionName = styled.div`
  font-size: 1rem;
  margin: .5rem 0;
  display: inline-block;
`;

const QuestionStatContainer = styled.div`
  /* margin: 1rem 0; */
`;

const MultChoice = styled.div`
  font-size: 1.2rem;
`;

const PercentagesContainer = styled.span`
  width: 200px;
  /* height: 20px; */
  margin: 0 1rem;
`;

const PercentBar = styled.div`
  border: 1px solid black;
  background: -webkit-linear-gradient(left, transparent 50%, white 50%);
  background: -moz-linear-gradient(left, transparent 50%, white 50%);
  background: -ms-linear-gradient(left, transparent 50%, white 50%);
  background: linear-gradient(left, transparent 50%, white 50%);
`;
