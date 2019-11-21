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
    chartData.forEach(question => {
      for (let option in question) {
        arrayOfBars.push(<VerticalBarSeries
          data={[question[option]]}
          onSeriesMouseOver={() => {
            rememberValue(option, question[option].y);
          }}
          onSeriesMouseOut={() =>
            setToolTip(null)}
        />);
      }
    });
    return arrayOfBars;
  }

  useEffect(() => {
    getSurveyResults();
  }, []);

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

  // function generateQuestionOverview() {
  //   return answerCounts.map(question => {
  //     const stats = [];
  //     for (let choice in question.results) {
  //       stats.push(
  //         <div>
  //           {choice} - {question.results[choice]}
  //         </div>
  //       );
  //     }
  //     return (
  //         <>
  //         <div>
  //           {question.question}
  //         </div>
  //         {stats}
  //       </>
  //     );
  //   });
  // }
  function StatsArray(props) {
    const { question } = props;
    return (
      <div>
        <h3>
          {question.x}
        </h3>
      </div>
    );
  }

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
        {responseCount ? answerCounts.map((question, i) => (
          <StatsArray key={i} question={question}/>
        )
        )
          : null}
      </div>
    </Container>
  )
    : <LoadingCircle />;
}

const PlotContainer = styled(XYPlot)`
  position: relative;
  margin: 0 auto;
`;
