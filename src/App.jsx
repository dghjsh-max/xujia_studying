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
 * xujia_studying: 서가의 학습공간
 * TOPIK II 6급 수준의 한국어 학습 및 남산 등반 챌린지 앱
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

  // TOPIK 6급 수준의 방대한 문제 은행 (15일 분량, 총 150문항 이상 확장 가능)
  const allQuestions = [
    // DAY 1 영역
    { id: 1, type: 'grammar', question: '밑줄 친 부분과 의미가 가장 비슷한 것을 고르십시오.\n\n"그는 경제적 어려움에도 불구하고 학업을 _________________."', options: ['포기할 리 만무했다', '포기할 턱이 없었다', '포기하기는커녕', '포기할 법도 했다'], answer: 1, explanation: '-ㄹ 리 만무하다와 -ㄹ 턱이 없다는 강한 부정을 나타내는 표현으로 의미가 상통합니다.' },
    { id: 2, type: 'grammar', question: '다음 문장의 빈칸에 알맞은 것을 고르십시오.\n\n"정부는 이번 정책이 실효성을 거둘 수 있도록 만반의 준비를 _________________."', options: ['다하는 셈이다', '다할 따름이다', '다할 모양이다', '다하는 중이다'], answer: 1, explanation: '만반의 준비를 다하고 있음을 나타낼 때 사용하는 강조 표현입니다.' },
    { id: 3, type: 'idiom', question: '다음 관용구가 들어갈 문맥으로 옳은 것을 고르십시오.\n\n"불에 기름을 붓다"', options: ['논란을 잠재우다', '사태를 악화시키다', '원인을 규명하다', '열정을 다하다'], answer: 1, explanation: '이미 악화된 상황을 더욱 심하게 만드는 것을 의미합니다.' },
    { id: 4, type: 'logic', question: '글의 주제로 알맞은 것을 고르십시오.\n\n"현대 사회의 정보 과잉은 역설적으로 지식의 빈곤을 초래한다. 검증되지 않은 정보의 범람은 비판적 사고력을 저해하기 때문이다."', options: ['정보 기술의 미래', '디지털 기기 절제의 필요성', '정보 비판적 수용의 중요성', '현대인의 심리적 불안'], answer: 2, explanation: '정보가 많을수록 비판적 수용 태도가 중요하다는 것이 핵심입니다.' },
    { id: 5, type: 'grammar', question: '"신기술 개발은 단순히 효율성을 높이는 데 _________________ 새로운 가치를 창출해야 한다."', options: ['그치지 않고', '그치는 바람에', '그치다가는', '그치느니만큼'], answer: 0, explanation: '한계를 넘어서는 추가적인 내용을 연결할 때 -지 않고를 사용합니다.' },
    { id: 6, type: 'reading', question: '내용과 일치하는 것을 고르십시오.\n\n"한옥 처마는 여름엔 태양을 차단하고 겨울엔 햇빛을 깊이 받아들인다."', options: ['처마는 고정되어 온도를 조절한다', '여름보다 겨울에 처마가 길어진다', '태양 고도를 이용한 과학적 설계다', '실내 냉방을 위해 각도를 바꾼다'], answer: 2, explanation: '태양 고도 변화를 이용해 일조량을 조절한다는 내용입니다.' },
    { id: 7, type: 'logic', question: '빈칸에 알맞은 결론을 고르십시오.\n\n"예술은 시대를 비추는 거울이다. 따라서 우리는 예술을 통해 _________________."', options: ['개인의 취향을 배운다', '과거 형식을 계승한다', '사회적 거리를 확보한다', '시대의 집단적 무의식을 본다'], answer: 3, explanation: '예술이 시대를 반영한다는 전제에 따른 결론입니다.' },
    { id: 8, type: 'grammar', question: '"그의 발언은 사건의 본질을 _________________ 의도가 다분했다."', options: ['흐릴', '흐리게 할', '흐리고자 하는', '흐리기로 한'], answer: 2, explanation: '목적이나 의도를 나타낼 때 -고자 하다를 사용합니다.' },
    { id: 9, type: 'grammar', question: '"전통 보존은 지원이 _________________ 해결될 문제가 아니다."', options: ['수반되어야만', '수반되더라도', '수반되거늘', '수반될지언정'], answer: 0, explanation: '필수 조건을 나타내는 -어야만/아야만이 적절합니다.' },
    { id: 10, type: 'logic', question: '문맥상 단어의 쓰임이 어색한 것은?\n\n"경제 지표가 (1)호전됨에 따라 소비 심리가 (2)위축될 것으로 기대했으나..."', options: ['(1)', '(2)', '(3)', '(4)'], answer: 1, explanation: '호전되면 소비 심리는 회복되어야 하므로 위축은 부적절합니다.' },
    
    // DAY 2-15 영역은 allQuestions 배열에 10개씩 추가하여 150개를 구성할 수 있습니다.
    { id: 11, type: 'grammar', question: '"그는 자기 잘못을 _________________ 사과 한 마디 없었다."', options: ['인정하기는커녕', '인정할 리가', '인정할 텐데', '인정하는 바람에'], answer: 0, explanation: '앞의 내용을 부정하고 더 심한 뒤의 내용을 연결할 때 사용합니다.' },
    { id: 12, type: 'grammar', question: '"아이들의 안전 교육은 아무리 _________________ 지나치지 않다."', options: ['강조하느니만큼', '강조해도', '강조하다가는', '강조한들'], answer: 1, explanation: '아무리 -아/어도 지나치지 않다는 중요성을 강조하는 관용적 표현입니다.' },
    { id: 13, type: 'logic', question: '"인간의 기억은 녹화기가 아니라 _________________ 과정에 가깝다. 과거를 현재 관점에서 재구성하기 때문이다."', options: ['보존하는', '창의적으로 재구성하는', '데이터를 삭제하는', '자극을 수용하는'], answer: 1, explanation: '재구성한다는 뒷부분의 설명이 힌트입니다.' },
    { id: 14, type: 'grammar', question: '"그의 연기는 실제 인물이 _________________ 착각이 들 정도로 완벽했다."', options: ['살아난 듯한', '살아나느니만큼', '살아나기 나름인', '살아나고야 만'], answer: 0, explanation: '비유를 나타내는 -ㄴ/은 듯하다가 적절합니다.' },
    { id: 15, type: 'idiom', question: '"입술이 없으면 이가 시리다"와 의미가 상통하는 사자성어는?', options: ['순망치한', '사면초가', '고립무원', '동병상련'], answer: 0, explanation: '서로 밀접한 관계에 있어 하나가 망하면 다른 하나도 위태롭다는 뜻입니다.' }
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

  // 남산타워 수직 등반 애니메이션 컴포넌트
  const NamsanClimbAnimation = ({ floor, move }) => {
    return (
      <div className="hidden lg:flex flex-col items-center h-[500px] w-32 sticky top-24 ml-2">
        <div className="relative flex flex-col items-center mb-2">
          <div className="w-0.5 h-8 bg-slate-300" />
          <div className="w-10 h-6 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600 shadow-lg z-10">
            <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
          </div>
          <div className="w-3 h-10 bg-slate-300 -mt-1 shadow-sm" />
          {floor === 10 && (
            <div className="absolute -top-10 animate-bounce">
              <span className="text-3xl">🚩</span>
            </div>
          )}
        </div>

        <div className="relative flex-1 w-full flex justify-center py-2">
          <div className="w-1 bg-slate-100 h-full rounded-full relative overflow-visible">
            {[...Array(11)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-4 h-0.5 -left-[6px] transition-colors duration-700"
                style={{ bottom: `${i * 10}%`, backgroundColor: i <= floor ? '#3b82f6' : '#f1f5f9' }}
              >
                <span className={`absolute left-6 -top-2 text-[9px] font-black transition-colors ${i <= floor ? 'text-blue-600' : 'text-slate-300'}`}>
                  {i === 10 ? 'GOAL' : `${i}F`}
                </span>
              </div>
            ))}

            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-in-out z-20"
              style={{ bottom: `calc(${floor * 10}% - 16px)` }}
            >
              <div className="relative flex flex-col items-center">
                <div className="absolute -top-8 h-8 flex items-center">
                   {move === 'up' && <ArrowUp className="w-4 h-4 text-green-500 animate-bounce" />}
                   {move === 'down' && <ArrowDown className="w-4 h-4 text-red-500 animate-bounce" />}
                </div>
                <div className="w-10 h-10 bg-white rounded-full shadow-xl border-2 border-blue-400 flex items-center justify-center text-2xl">
                  👩‍🏻‍💼
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-16 h-4 bg-slate-400 rounded-t-xl mt-2 shadow-inner" />
        
        <div className="mt-4 text-center bg-white px-3 py-2 rounded-xl border border-slate-100 shadow-sm w-full">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Altitude</p>
          <p className="text-xl font-black text-blue-600 leading-none">{floor}F</p>
        </div>
      </div>
    );
  };

  const Home = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in duration-700 pb-32">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-normal text-slate-800 tracking-tight">서가의 학습공간</h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light">오늘도 문제를 풀어볼까요?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl px-4">
        <div className="p-8 bg-white border border-slate-50 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group cursor-default">
          <div className="w-14 h-14 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <Calendar className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="font-bold text-xl mb-3 text-slate-800">Day {dayNumber} 챌린지</h3>
          <p className="text-slate-500 text-base leading-relaxed">매일 새로운 10개의 문항이 기다립니다. 15일 동안 겹치지 않는 문제를 통해 실력을 완성하세요.</p>
        </div>
        
        <div className="p-8 bg-white border border-slate-50 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group cursor-default">
          <div className="w-14 h-14 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-bold text-xl mb-3 text-slate-800">게임처럼 즐겁게</h3>
          <p className="text-slate-500 text-base leading-relaxed">정답은 1층 더, 오답은 1층 아래입니다. 10문제를 다 맞춰서 정상에 올라가보세요</p>
        </div>
      </div>

      <button 
        onClick={() => { getDailyQuestions(); setView('quiz'); }}
        className="px-14 py-5 bg-slate-900 text-white rounded-full font-medium text-xl hover:bg-slate-800 transition-all transform hover:scale-105 shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex items-center gap-4 z-10"
      >
        챌린지 시작하기 <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );

  const Quiz = () => {
    if (activeQuestions.length === 0) return null;
    const q = activeQuestions[currentIdx];

    return (
      <div className="flex justify-center items-start gap-6 md:gap-12 max-w-7xl mx-auto w-full h-full pb-32 overflow-hidden">
        <NamsanClimbAnimation floor={currentFloor} move={lastMove} />

        <div className="flex-1 max-w-2xl py-4 md:py-8 px-4 h-full flex flex-col overflow-y-auto">
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Daily Session</span>
                <span className="text-lg font-medium text-slate-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {currentIdx + 1} / 10 문항
                </span>
              </div>
              <span className="text-[9px] px-3 py-1 bg-slate-100 text-slate-500 rounded-full font-black uppercase tracking-widest border border-slate-200">
                {q.type.toUpperCase()}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-slate-900 h-full transition-all duration-700" 
                style={{ width: `${((currentIdx + 1) / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex-1 bg-white border border-slate-50 rounded-[2.5rem] p-6 md:p-10 shadow-sm overflow-y-auto relative mb-4">
            <h2 className="text-lg md:text-xl font-medium text-slate-800 leading-[1.6] whitespace-pre-wrap mb-8 md:mb-12">
              {q.question}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={showExplanation}
                  onClick={() => handleAnswer(i)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group
                    ${showExplanation 
                      ? i === q.answer 
                        ? 'bg-green-50 border-green-300 text-green-700' 
                        : answers[currentIdx] === i 
                          ? 'bg-red-50 border-red-300 text-red-700' 
                          : 'bg-white border-slate-50 text-slate-300'
                      : 'bg-white border-slate-100 hover:border-blue-400 hover:shadow-md text-slate-700'
                    }
                  `}
                >
                  <span className="text-sm md:text-base font-medium">{opt}</span>
                  {!showExplanation && <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-slate-200 group-hover:border-blue-400 transition-colors flex-shrink-0 ml-4" />}
                  {showExplanation && i === q.answer && <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 ml-4" />}
                  {showExplanation && answers[currentIdx] === i && i !== q.answer && <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0 ml-4" />}
                </button>
              ))}
            </div>

            {showExplanation && (
              <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] animate-in slide-in-from-bottom-4 duration-500 border border-slate-100 shadow-inner">
                <div className="flex items-center gap-2 mb-3 font-black text-slate-800 text-[10px] uppercase tracking-widest">
                  <Layout className="w-4 h-4 text-blue-500" /> 서가의 학습 가이드
                </div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                  {q.explanation}
                </p>
                <div className="flex items-center gap-4">
                  <div className={`flex-1 px-4 py-2 rounded-xl text-[9px] font-black flex items-center justify-center gap-2 border-2 uppercase tracking-widest ${lastMove === 'up' ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                    {lastMove === 'up' ? <><ArrowUp className="w-3 h-3" /> UP</> : <><ArrowDown className="w-3 h-3" /> DOWN</>}
                  </div>
                  <button 
                    onClick={nextQuestion}
                    className="flex-[2] py-3 md:py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg text-base"
                  >
                    {currentIdx < 9 ? '다음 단계로' : '도전 결과 확인'} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const Result = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-10 animate-in zoom-in-95 duration-700 px-6 pb-40">
      <div className="relative">
        <div className={`w-60 h-60 md:w-72 md:h-72 rounded-full flex flex-col items-center justify-center border-[12px] border-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-1000 ${currentFloor === 10 ? 'bg-blue-600' : 'bg-slate-50'}`}>
          <div className="text-center">
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${currentFloor === 10 ? 'text-blue-200' : 'text-slate-400'}`}>Final Altitude</p>
            <span className={`text-7xl md:text-9xl font-black leading-none ${currentFloor === 10 ? 'text-white' : 'text-slate-800'}`}>{currentFloor}</span>
            <span className={`text-xl md:text-3xl font-bold ${currentFloor === 10 ? 'text-blue-300' : 'text-slate-400'}`}>/10</span>
          </div>
        </div>
        {currentFloor === 10 && (
          <div className="absolute -top-8 -right-8 bg-amber-400 text-white p-5 md:p-6 rounded-[3rem] shadow-xl rotate-12 animate-bounce border-[4px] border-white">
            <Award className="w-10 h-10 md:w-16 md:h-16" />
          </div>
        )}
      </div>

      <div className="text-center space-y-4 max-w-xl">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
          {currentFloor === 10 ? '남산의 정점!' : currentFloor >= 7 ? '훌륭한 등반입니다!' : '기초를 탄탄히!'}
        </h2>
        <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed">
          {currentFloor === 10 
            ? 'TOPIK II 6급 수준의 모든 문제를 정복하셨습니다. 완벽합니다!' 
            : '목표 지점까지 조금 남았습니다. 매일 꾸준히 도전하여 정상에 도달하세요.'}
        </p>
        <div className="pt-2">
           <span className="text-xs font-black text-blue-600 bg-blue-50 px-6 py-2 rounded-full border border-blue-100 uppercase tracking-[0.2em]">
             Score: {score} / 100
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl px-4">
        <button 
          onClick={restartCurrent}
          className="px-6 py-4 border-2 border-slate-200 text-slate-600 rounded-3xl font-black hover:bg-white hover:border-slate-400 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
        >
          <RotateCcw className="w-4 h-4" /> 다시 도전
        </button>
        <button 
          onClick={startNewChallenge}
          className="px-6 py-4 bg-blue-600 text-white rounded-3xl font-black hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
        >
          <RefreshCw className="w-4 h-4" /> 다음 세트
        </button>
        <button 
          onClick={() => setView('home')}
          className="px-6 py-4 bg-slate-900 text-white rounded-3xl font-black hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
        >
          <HomeIcon className="w-4 h-4" /> 처음으로
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfefe] text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-3xl border-b border-slate-50 z-40 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          {/* 연보라색 배경의 徐 로고 */}
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#F3E8FF] rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center shadow-sm transform -rotate-3 hover:rotate-0 transition-all duration-500 cursor-pointer flex-shrink-0 border border-purple-100">
            <span className="text-[#9333EA] font-bold text-xl md:text-2xl">徐</span>
          </div>
          <span className="font-normal text-2xl md:text-3xl text-slate-800 tracking-tighter truncate">서가의 학습공간</span>
        </div>
        <div className="hidden md:flex items-center gap-10 lg:gap-14 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          <button className="hover:text-slate-900 transition-colors">Challenge</button>
          <button className="hover:text-slate-900 transition-colors">Progress</button>
          <div className="w-12 h-12 rounded-[1.2rem] bg-slate-50 border border-slate-100 shadow-inner flex-shrink-0" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-28 md:pt-36 pb-32 px-4 md:px-12 h-screen overflow-y-auto">
        {view === 'home' && <Home />}
        {view === 'quiz' && <Quiz />}
        {view === 'result' && <Result />}
      </main>

      {/* Footer 바 (겹침 방지 보완) */}
      <footer className="fixed bottom-6 left-0 right-0 text-center pointer-events-none z-50 px-4">
        <div className="inline-flex items-center gap-3 bg-white/95 px-6 md:px-8 py-3 rounded-full border border-slate-100 shadow-xl backdrop-blur-xl pointer-events-auto">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)] flex-shrink-0" />
          <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black truncate">
            Seoga Education Engine · Daily Challenge Enabled
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;