import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  Layout, 
  Award, 
  RotateCcw, 
  AlertCircle, 
  MapPin, 
  ArrowDown, 
  ArrowUp, 
  RefreshCw, 
  Home as HomeIcon, 
  Calendar, 
  Gamepad2 
} from 'lucide-react';

/**
 * xujia_studying: 서가의 학습공간 (v2.2)
 * - 푸터 문구 수정: XUJIA STUDYING ENGINE . DAILY CHALLENGE ENABLED
 * - UI/UX 최적화 및 레이아웃 겹침 방지
 */

const App = () => {
  const [view, setView] = useState('home'); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentFloor, setCurrentFloor] = useState(0); 
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastMove, setLastMove] = useState(null); 
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [dayNumber, setDayNumber] = useState(1);

  // TOPIK 6급 수준의 문제 은행
  const allQuestions = [
    { id: 1, type: 'grammar', question: '밑줄 친 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n"그는 경제적 어려움에도 불구하고 학업을 _________________."', options: ['포기할 리 만무했다', '포기할 턱이 없었다', '포기하기는커녕', '포기할 법도 했다'], answer: 1, explanation: '-ㄹ 리 만무하다와 -ㄹ 턱이 없다는 강한 부정을 나타내는 표현으로 의미가 상통합니다.' },
    { id: 2, type: 'grammar', question: '정부는 이번 정책이 실효성을 거둘 수 있도록 만반의 준비를 _________________.', options: ['다하는 셈이다', '다할 따름이다', '다할 모양이다', '다하는 중이다'], answer: 1, explanation: '만반의 준비를 다하고 있음을 나타낼 때 사용하는 강조 표현입니다.' },
    { id: 3, type: 'idiom', question: '다음 관용구가 들어갈 문맥으로 옳은 것을 고르십시오.\n\n"불에 기름을 붓다"', options: ['논란을 잠재우다', '사태를 악화시키다', '원인을 규명하다', '열정을 다하다'], answer: 1, explanation: '이미 악화된 상황을 더욱 심하게 만드는 것을 의미합니다.' },
    { id: 4, type: 'logic', question: '글의 주제로 알맞은 것을 고르십시오.\n\n"현대 사회의 정보 과잉은 역설적으로 지식의 빈곤을 초래한다. 검증되지 않은 정보의 범람은 비판적 사고력을 저해하기 때문이다."', options: ['정보 기술의 미래', '디지털 기기 절제의 필요성', '정보 비판적 수용의 중요성', '현대인의 심리적 불안'], answer: 2, explanation: '정보가 많을수록 비판적 수용 태도가 중요하다는 것이 핵심입니다.' },
    { id: 5, type: 'grammar', question: '"신기술 개발은 단순히 효율성을 높이는 데 _________________ 새로운 가치를 창출해야 한다."', options: ['그치지 않고', '그치는 바람에', '그치다가는', '그치느니만큼'], answer: 0, explanation: '한계를 넘어서는 추가적인 내용을 연결할 때 -지 않고를 사용합니다.' },
    { id: 6, type: 'reading', question: '내용과 일치하는 것을 고르십시오.\n\n"한옥 처마는 여름엔 태양을 차단하고 겨울엔 햇빛을 깊이 받아들인다."', options: ['처마는 고정되어 온도를 조절한다', '여름보다 겨울에 처마가 길어진다', '태양 고도를 이용한 과학적 설계다', '실내 냉방을 위해 각도를 바꾼다'], answer: 2, explanation: '태양 고도 변화를 이용해 일조량을 조절한다는 내용입니다.' },
    { id: 7, type: 'logic', question: '빈칸에 알맞은 결론을 고르십시오.\n\n"예술은 시대를 비추는 거울이다. 따라서 우리는 예술을 통해 _________________."', options: ['개인의 취향을 배운다', '과거 형식을 계승한다', '사회적 거리를 확보한다', '시대의 집단적 무의식을 본다'], answer: 3, explanation: '예술이 시대를 반영한다는 전제에 따른 결론입니다.' },
    { id: 8, type: 'grammar', question: '"그의 발언은 사건의 본질을 _________________ 의도가 다분했다."', options: ['흐릴', '흐리게 할', '흐리고자 하는', '흐리기로 한'], answer: 2, explanation: '목적이나 의도를 나타낼 때 -고자 하다를 사용합니다.' },
    { id: 9, type: 'grammar', question: '"전통 보존은 지원이 _________________ 해결될 문제가 아니다."', options: ['수반되어야만', '수반되더라도', '수반되거늘', '수반될지언정'], answer: 0, explanation: '필수 조건을 나타내는 -어야만/아야만이 적절합니다.' },
    { id: 10, type: 'logic', question: '문맥상 단어의 쓰임이 어색한 것은?\n\n"경제 지표가 (1)호전됨에 따라 소비 심리가 (2)위축될 것으로 기대했으나..."', options: ['(1)', '(2)', '(3)', '(4)'], answer: 1, explanation: '호전되면 소비 심리는 회복되어야 하므로 위축은 부적절합니다.' }
  ];

  const getDailyQuestions = () => {
    const today = new Date();
    const startDate = new Date('2026-03-20'); 
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) % 15; 
    setDayNumber(diffDays + 1);
    const startIdx = (diffDays * 10) % allQuestions.length;
    let selected = [];
    for(let i = 0; i < 10; i++) {
      const q = allQuestions[(startIdx + i) % allQuestions.length];
      if (q) selected.push(q);
    }
    setActiveQuestions(selected);
  };

  useEffect(() => {
    getDailyQuestions();
  }, []);

  const handleAnswer = (idx) => {
    if (showExplanation) return;
    const newAnswers = [...answers];
    newAnswers[currentIdx] = idx;
    setAnswers(newAnswers);
    setShowExplanation(true);

    if (idx === activeQuestions[currentIdx].answer) {
      setCurrentFloor(prev => Math.min(10, prev + 1));
      setScore(prev => prev + 10);
      setLastMove('up');
    } else {
      setCurrentFloor(prev => Math.max(0, prev - 1));
      setLastMove('down');
    }
  };

  const nextQuestion = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(false);
      setLastMove(null);
    } else {
      setView('result');
    }
  };

  const restartCurrent = () => {
    setCurrentIdx(0);
    setCurrentFloor(0);
    setAnswers([]);
    setScore(0);
    setShowExplanation(false);
    setLastMove(null);
    setView('quiz');
  };

  const startNewChallenge = () => {
    getDailyQuestions();
    restartCurrent();
  };

  const NamsanClimbAnimation = ({ floor, move }) => {
    return (
      <div className="hidden lg:flex flex-col items-center h-[450px] w-28 sticky top-32">
        <div className="relative flex flex-col items-center">
          <div className="w-0.5 h-6 bg-slate-300" />
          <div className="w-8 h-5 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 shadow-md z-10">
            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
          </div>
          <div className="w-2 h-8 bg-slate-300 -mt-1" />
          {floor === 10 && <div className="absolute -top-8 animate-bounce"><span className="text-2xl">🚩</span></div>}
        </div>
        <div className="relative flex-1 w-full flex justify-center py-2">
          <div className="w-1 bg-slate-100 h-full rounded-full relative">
            {[...Array(11)].map((_, i) => (
              <div key={i} className="absolute w-3 h-0.5 -left-[4px]" style={{ bottom: `${i * 10}%`, backgroundColor: i <= floor ? '#3b82f6' : '#f1f5f9' }}>
                <span className={`absolute left-5 -top-1.5 text-[8px] font-black ${i <= floor ? 'text-blue-600' : 'text-slate-300'}`}>{i === 10 ? 'GOAL' : `${i}F`}</span>
              </div>
            ))}
            <div className="absolute left-1/2 -translate-x-1/2 transition-all duration-700 z-20" style={{ bottom: `calc(${floor * 10}% - 14px)` }}>
              <div className="relative flex flex-col items-center">
                <div className="absolute -top-6">
                   {move === 'up' && <ArrowUp className="w-3 h-3 text-green-500 animate-bounce" />}
                   {move === 'down' && <ArrowDown className="w-3 h-3 text-red-500 animate-bounce" />}
                </div>
                <div className="w-8 h-8 bg-white rounded-full shadow-lg border border-blue-400 flex items-center justify-center text-xl">👩‍🏻‍💼</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-12 h-3 bg-slate-400 rounded-t-lg mt-2 shadow-inner" />
        <div className="mt-2 text-center bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-blue-600">{floor}F</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfefe] text-slate-900 font-sans overflow-x-hidden flex flex-col">
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-50 z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F3E8FF] rounded-2xl flex items-center justify-center shadow-sm border border-purple-100">
            <span className="text-[#9333EA] font-bold text-lg md:text-xl">徐</span>
          </div>
          <span className="font-normal text-xl md:text-2xl text-slate-800 tracking-tighter truncate">서가의 학습공간</span>
        </div>
        <div className="hidden sm:flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <button className="hover:text-slate-900">Challenge</button>
          <button className="hover:text-slate-900">Progress</button>
        </div>
      </nav>

      <main className="flex-1 pt-24 pb-32 px-4 md:px-12 w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        {view === 'home' && (
          <div className="w-full space-y-8 text-center animate-in fade-in duration-700">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-slate-800 tracking-tight">서가의 학습공간</h1>
              <p className="text-lg md:text-xl text-slate-400 font-light">오늘도 문제를 풀어볼까요?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
              <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm text-left group">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <Calendar className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Day {dayNumber} 챌린지</h3>
                <p className="text-slate-500 text-sm leading-relaxed">매일 새로운 10개의 문항을 통해 실력을 완성하세요.</p>
              </div>
              <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm text-left group">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-6">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">게임처럼 즐겁게</h3>
                <p className="text-slate-500 text-sm leading-relaxed">정답은 1층 더, 오답은 1층 아래입니다. 10문제를 다 맞춰서 정상에 올라가보세요</p>
              </div>
            </div>
            <button onClick={startNewChallenge} className="px-12 py-4 bg-slate-900 text-white rounded-full font-medium text-lg hover:scale-105 transition-all shadow-xl flex items-center gap-3 mx-auto">
              챌린지 시작하기 <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {view === 'quiz' && (
          <div className="flex w-full justify-center gap-6 lg:gap-12 items-start animate-in fade-in duration-500">
            <NamsanClimbAnimation floor={currentFloor} move={lastMove} />
            <div className="flex-1 max-w-2xl space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-lg font-medium text-slate-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {currentIdx + 1} / 10
                </span>
                <span className="text-[10px] px-3 py-1 bg-slate-100 text-slate-500 rounded-full font-bold uppercase tracking-widest border border-slate-200">
                  {activeQuestions[currentIdx]?.type.toUpperCase()}
                </span>
              </div>
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8">
                <h2 className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed break-keep">
                  {activeQuestions[currentIdx]?.question}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {activeQuestions[currentIdx]?.options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={showExplanation}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group
                        ${showExplanation 
                          ? i === activeQuestions[currentIdx].answer ? 'bg-green-50 border-green-300 text-green-700' : answers[currentIdx] === i ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white opacity-50'
                          : 'bg-white border-slate-100 hover:border-blue-400 hover:shadow-sm'
                        }
                      `}
                    >
                      <span className="text-base md:text-lg">{opt}</span>
                      {!showExplanation && <div className="w-4 h-4 rounded-full border border-slate-200 group-hover:border-blue-400" />}
                      {showExplanation && i === activeQuestions[currentIdx].answer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </button>
                  ))}
                </div>
                {showExplanation && (
                  <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-bottom-2">
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed">{activeQuestions[currentIdx]?.explanation}</p>
                    <button onClick={nextQuestion} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                      {currentIdx < 9 ? '다음 단계로' : '결과 확인'} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'result' && (
          <div className="flex flex-col items-center space-y-10 animate-in zoom-in-95">
            <div className={`w-60 h-60 md:w-72 md:h-72 rounded-full flex flex-col items-center justify-center border-8 border-white shadow-xl ${currentFloor === 10 ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-800'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest mb-1">Altitude</span>
              <span className="text-8xl font-black">{currentFloor}</span>
              <span className="text-xl font-bold opacity-60">/ 10F</span>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-slate-900">{currentFloor === 10 ? '남산의 정점!' : '멋진 도전입니다!'}</h2>
              <p className="text-slate-400 text-lg">점수: {score}점 / 100점</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={startNewChallenge} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> 다른 문제
              </button>
              <button onClick={() => setView('home')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg">
                처음으로
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full py-8 flex justify-center mt-auto">
        <div className="inline-flex items-center gap-3 bg-white/95 px-6 py-3 rounded-full border border-slate-100 shadow-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
            XUJIA STUDYING ENGINE . DAILY CHALLENGE ENABLED
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;