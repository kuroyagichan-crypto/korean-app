import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// 52週カリキュラム  TOPIK 4級 1年ロードマップ
// Phase 1 (W01-16): TOPIK 1-2級基礎
// Phase 2 (W17-32): TOPIK 2-3級日常
// Phase 3 (W33-48): TOPIK 3-4級発展
// Phase 4 (W49-52): TOPIK 4級仕上げ
// ═══════════════════════════════════════════════════════════
const CURRICULUM = [
  // ── PHASE 1: 基礎 ─────────────────────────────────────
  { week:1, phase:1, theme:"あいさつ・出会い", topik:"TOPIK 1級準備",
    morning:{
      phrase:{kr:"안녕하세요! 처음 뵙겠습니다.", rom:"アンニョンハセヨ！チョウム ペッケッスムニダ", ja:"こんにちは！はじめまして。"},
      vocab:[
        {kr:"안녕하세요", rom:"アンニョンハセヨ", ja:"こんにちは"},
        {kr:"처음 뵙겠습니다", rom:"チョウム ペッケッスムニダ", ja:"はじめまして"},
        {kr:"반갑습니다", rom:"パンガプスムニダ", ja:"お会いできて嬉しいです"},
        {kr:"잘 부탁드려요", rom:"チャル プタットゥリョヨ", ja:"よろしくお願いします"},
        {kr:"안녕히 가세요", rom:"アンニョンヒ カセヨ", ja:"さようなら（去る人へ）"},
      ],
      grammar:{point:"〜이에요 / 예요", ja:"〜です（名詞文）", example:"저는 히로시예요. ／ 일본 사람이에요."}
    }
  },
  { week:2, phase:1, theme:"自己紹介", topik:"TOPIK 1級準備",
    morning:{
      phrase:{kr:"저는 일본에서 온 히로시예요.", rom:"チョヌン イルボネソ オン ヒロシエヨ", ja:"日本から来たひろしです。"},
      vocab:[
        {kr:"이름이 뭐예요?", rom:"イルミ ムォエヨ？", ja:"お名前は何ですか？"},
        {kr:"어디서 왔어요?", rom:"オディソ ワッソヨ？", ja:"どこから来ましたか？"},
        {kr:"나이가 어떻게 돼요?", rom:"ナイガ オットケ テヨ？", ja:"年齢はいくつですか？"},
        {kr:"직업이 뭐예요?", rom:"チゴビ ムォエヨ？", ja:"お仕事は何ですか？"},
        {kr:"결혼했어요?", rom:"キョロネッソヨ？", ja:"結婚していますか？"},
      ],
      grammar:{point:"〜에서 왔어요", ja:"〜から来ました", example:"도쿄에서 왔어요. (東京から来ました)"}
    }
  },
  { week:3, phase:1, theme:"家族・親族", topik:"TOPIK 1級準備",
    morning:{
      phrase:{kr:"저는 한국인 아내가 있어요.", rom:"チョヌン ハングギン アネガ イッソヨ", ja:"私には韓国人の妻がいます。"},
      vocab:[
        {kr:"아내 / 남편", rom:"アネ／ナムピョン", ja:"妻／夫"},
        {kr:"부모님", rom:"プモニム", ja:"ご両親"},
        {kr:"장인어른 / 장모님", rom:"チャンイノルン／チャンモニム", ja:"義父／義母"},
        {kr:"형제자매", rom:"ヒョンジェジャメ", ja:"兄弟姉妹"},
        {kr:"자녀 / 아이", rom:"チャニョ／アイ", ja:"子ども"},
      ],
      grammar:{point:"〜이/가 있어요", ja:"〜がいます・あります", example:"아내가 있어요. ／ 아이가 두 명 있어요."}
    }
  },
  { week:4, phase:1, theme:"数字・曜日・時間", topik:"TOPIK 1級準備",
    morning:{
      phrase:{kr:"지금 몇 시예요?", rom:"チグム ミョッ シエヨ？", ja:"今何時ですか？"},
      vocab:[
        {kr:"일, 이, 삼, 사, 오", rom:"イル, イ, サム, サ, オ", ja:"1, 2, 3, 4, 5（漢数字）"},
        {kr:"하나, 둘, 셋, 넷, 다섯", rom:"ハナ, トゥル, セッ, ネッ, タソッ", ja:"1, 2, 3, 4, 5（固有数字）"},
        {kr:"오늘, 내일, 어제", rom:"オヌル, ネイル, オジェ", ja:"今日, 明日, 昨日"},
        {kr:"몇 시예요?", rom:"ミョッ シエヨ？", ja:"何時ですか？"},
        {kr:"요일", rom:"ヨイル", ja:"曜日"},
      ],
      grammar:{point:"〜시 〜분이에요", ja:"〜時〜分です", example:"세 시 반이에요. (3時半です)"}
    }
  },
  { week:5, phase:1, theme:"買い物・値段", topik:"TOPIK 1級準備",
    morning:{
      phrase:{kr:"이거 얼마예요? 좀 깎아 주세요.", rom:"イゴ オルマエヨ？チョム ッカッカ チュセヨ", ja:"これはいくらですか？少し負けてください。"},
      vocab:[
        {kr:"얼마예요?", rom:"オルマエヨ？", ja:"いくらですか？"},
        {kr:"비싸요 / 싸요", rom:"ピッサヨ／ッサヨ", ja:"高いです／安いです"},
        {kr:"카드 돼요?", rom:"カドゥ テヨ？", ja:"カードは使えますか？"},
        {kr:"봉투 주세요", rom:"ポントゥ チュセヨ", ja:"袋をください"},
        {kr:"영수증 주세요", rom:"ヨンスジュン チュセヨ", ja:"レシートをください"},
      ],
      grammar:{point:"〜 주세요", ja:"〜をください（丁寧な依頼）", example:"물 주세요. ／ 이거 주세요."}
    }
  },
  { week:6, phase:1, theme:"レストラン・注文", topik:"TOPIK 1-2級準備",
    morning:{
      phrase:{kr:"이 음식은 맵지 않죠? 저는 매운 거 못 먹어요.", rom:"イ ウムシグン メプチ アンチョ？チョヌン メウン ゴ モン モゴヨ", ja:"この料理は辛くないですよね？私は辛いものが食べられません。"},
      vocab:[
        {kr:"메뉴판 주세요", rom:"メニュパン チュセヨ", ja:"メニューをください"},
        {kr:"추천해 주세요", rom:"チュチョンヘ チュセヨ", ja:"おすすめしてください"},
        {kr:"맛있어요 / 맛없어요", rom:"マシッソヨ／マドプソヨ", ja:"おいしい／まずい"},
        {kr:"물 더 주세요", rom:"ムル ト チュセヨ", ja:"お水をおかわりください"},
        {kr:"계산해 주세요", rom:"ケサンヘ チュセヨ", ja:"お会計をお願いします"},
      ],
      grammar:{point:"못 〜어요/아요", ja:"〜できません（不可能）", example:"저는 술을 못 마셔요. (私はお酒が飲めません)"}
    }
  },
  { week:7, phase:1, theme:"交通・道案内", topik:"TOPIK 1-2級準備",
    morning:{
      phrase:{kr:"이 버스가 명동에 가요?", rom:"イ ポスガ ミョンドンエ カヨ？", ja:"このバスは明洞に行きますか？"},
      vocab:[
        {kr:"지하철 / 버스 / 택시", rom:"チハチョル／ポス／テクシ", ja:"地下鉄／バス／タクシー"},
        {kr:"어디서 내려요?", rom:"オディソ ネリョヨ？", ja:"どこで降りますか？"},
        {kr:"갈아타세요", rom:"カラタセヨ", ja:"乗り換えてください"},
        {kr:"얼마나 걸려요?", rom:"オルマナ コルリョヨ？", ja:"どのくらいかかりますか？"},
        {kr:"길을 잃었어요", rom:"キルル イロッソヨ", ja:"道に迷いました"},
      ],
      grammar:{point:"〜에 가려면 어떻게 해요?", ja:"〜に行くにはどうすれば？", example:"명동에 가려면 어떻게 해요?"}
    }
  },
  { week:8, phase:1, theme:"道・場所・位置", topik:"TOPIK 1-2級準備",
    morning:{
      phrase:{kr:"저기서 오른쪽으로 돌아가세요.", rom:"チョギソ オルンチョグロ トラガセヨ", ja:"あそこで右に曲がってください。"},
      vocab:[
        {kr:"오른쪽 / 왼쪽", rom:"オルンチョク／ウェンチョク", ja:"右／左"},
        {kr:"직진하세요", rom:"チクチナセヨ", ja:"まっすぐ行ってください"},
        {kr:"근처에 있어요?", rom:"クンチョエ イッソヨ？", ja:"近くにありますか？"},
        {kr:"앞 / 뒤 / 옆", rom:"アプ／トゥィ／ヨプ", ja:"前／後ろ／横"},
        {kr:"지도 보여 주세요", rom:"チド ポヨ チュセヨ", ja:"地図を見せてください"},
      ],
      grammar:{point:"〜(으)로 가세요", ja:"〜の方向へ行ってください", example:"이쪽으로 가세요. (こちらへ行ってください)"}
    }
  },
  { week:9, phase:1, theme:"天気・季節", topik:"TOPIK 2級準備",
    morning:{
      phrase:{kr:"오늘 날씨가 어때요? 비가 올 것 같아요.", rom:"オヌル ナルッシガ オッテヨ？ピガ オル ゴッ カタヨ", ja:"今日の天気はどうですか？雨が降りそうです。"},
      vocab:[
        {kr:"날씨가 좋아요 / 나빠요", rom:"ナルッシガ チョアヨ／ナッパヨ", ja:"天気がいい／悪い"},
        {kr:"덥다 / 춥다", rom:"トプタ／チュプタ", ja:"暑い／寒い"},
        {kr:"비 / 눈 / 바람", rom:"ピ／ヌン／パラム", ja:"雨／雪／風"},
        {kr:"흐려요 / 맑아요", rom:"フリョヨ／マルガヨ", ja:"曇っています／晴れています"},
        {kr:"우산 챙기세요", rom:"ウサン チェンギセヨ", ja:"傘を持っていってください"},
      ],
      grammar:{point:"〜(으)ㄹ 것 같아요", ja:"〜しそうです（推測）", example:"비가 올 것 같아요. (雨が降りそうです)"}
    }
  },
  { week:10, phase:1, theme:"健康・体の不調", topik:"TOPIK 2級準備",
    morning:{
      phrase:{kr:"머리가 아파요. 약이 있어요?", rom:"モリガ アパヨ。ヤギ イッソヨ？", ja:"頭が痛いです。薬はありますか？"},
      vocab:[
        {kr:"머리 / 배 / 목", rom:"モリ／ペ／モク", ja:"頭／お腹／のど"},
        {kr:"아파요 / 열이 있어요", rom:"アパヨ／ヨリ イッソヨ", ja:"痛いです／熱があります"},
        {kr:"병원 / 약국", rom:"ピョンウォン／ヤックク", ja:"病院／薬局"},
        {kr:"처방전", rom:"チョバンジョン", ja:"処方箋"},
        {kr:"괜찮아요 / 많이 아파요", rom:"ケンチャナヨ／マニ アパヨ", ja:"大丈夫です／とても痛いです"},
      ],
      grammar:{point:"〜이/가 아파요", ja:"〜が痛いです", example:"배가 아파요. ／ 목이 아파요."}
    }
  },
  { week:11, phase:1, theme:"趣味・余暇", topik:"TOPIK 2級準備",
    morning:{
      phrase:{kr:"취미가 뭐예요? 저는 등산을 좋아해요.", rom:"チュィミガ ムォエヨ？チョヌン トゥンサヌル チョアヘヨ", ja:"趣味は何ですか？私は登山が好きです。"},
      vocab:[
        {kr:"좋아하다 / 싫어하다", rom:"チョアハダ／シロハダ", ja:"好きだ／嫌いだ"},
        {kr:"운동 / 독서 / 요리", rom:"ウンドン／トクソ／ヨリ", ja:"スポーツ／読書／料理"},
        {kr:"주말에 뭐 해요?", rom:"チュマレ ムォ ヘヨ？", ja:"週末に何しますか？"},
        {kr:"같이 할래요?", rom:"カチ ハルレヨ？", ja:"一緒にやりませんか？"},
        {kr:"재미있어요!", rom:"チェミイッソヨ！", ja:"楽しいです！"},
      ],
      grammar:{point:"〜을/를 좋아해요", ja:"〜が好きです", example:"음악을 좋아해요. ／ 한국 음식을 좋아해요."}
    }
  },
  { week:12, phase:1, theme:"日常の動作・習慣", topik:"TOPIK 2級準備",
    morning:{
      phrase:{kr:"아침마다 커피를 마셔요. 습관이에요.", rom:"アチムマダ コピルル マショヨ。スッカニエヨ", ja:"毎朝コーヒーを飲みます。習慣です。"},
      vocab:[
        {kr:"일어나다 / 자다", rom:"イロナダ／チャダ", ja:"起きる／寝る"},
        {kr:"씻다 / 밥을 먹다", rom:"シッタ／パブル モクタ", ja:"洗う／ご飯を食べる"},
        {kr:"출근하다 / 퇴근하다", rom:"チュルグナダ／トェグナダ", ja:"出勤する／退勤する"},
        {kr:"항상 / 보통 / 가끔", rom:"ハンサン／ポトン／カックム", ja:"いつも／普通／たまに"},
        {kr:"매일 / 매주", rom:"メイル／メジュ", ja:"毎日／毎週"},
      ],
      grammar:{point:"〜마다", ja:"〜ごとに・〜のたびに", example:"주말마다 운동해요. (週末のたびに運動します)"}
    }
  },
  { week:13, phase:1, theme:"電話・連絡", topik:"TOPIK 2級準備",
    morning:{
      phrase:{kr:"여보세요? 지금 통화 괜찮으세요?", rom:"ヨボセヨ？チグム トンファ ケンチャヌセヨ？", ja:"もしもし？今お話しできますか？"},
      vocab:[
        {kr:"여보세요", rom:"ヨボセヨ", ja:"もしもし"},
        {kr:"전화했어요", rom:"チョナヘッソヨ", ja:"電話しました"},
        {kr:"메시지 남겨 주세요", rom:"メシジ ナムギョ チュセヨ", ja:"メッセージを残してください"},
        {kr:"잠깐만요", rom:"チャムカンマニョ", ja:"少々お待ちください"},
        {kr:"연락할게요", rom:"ヨルラカルケヨ", ja:"連絡します"},
      ],
      grammar:{point:"〜(으)ㄹ게요", ja:"〜します（約束・意志）", example:"내일 전화할게요. (明日電話します)"}
    }
  },
  { week:14, phase:1, theme:"感情・気持ちの表現", topik:"TOPIK 2級準備",
    morning:{
      phrase:{kr:"기뻐요! 정말 감동적이에요.", rom:"キッポヨ！チョンマル カムドンジョギエヨ", ja:"嬉しいです！本当に感動的です。"},
      vocab:[
        {kr:"기쁘다 / 슬프다", rom:"キップダ／スルプダ", ja:"嬉しい／悲しい"},
        {kr:"화가 나다 / 무섭다", rom:"ファガ ナダ／ムソプタ", ja:"怒る／怖い"},
        {kr:"피곤해요 / 심심해요", rom:"ピゴンヘヨ／シムシメヨ", ja:"疲れました／暇です"},
        {kr:"걱정돼요", rom:"コクチョンドェヨ", ja:"心配です"},
        {kr:"그립다", rom:"クリプタ", ja:"懐かしい・恋しい"},
      ],
      grammar:{point:"〜아서/어서 기뻐요", ja:"〜なので嬉しいです", example:"만나서 반가워요. (会えて嬉しいです)"}
    }
  },
  { week:15, phase:1, theme:"食べ物・韓国料理", topik:"TOPIK 2級準備",
    morning:{
      phrase:{kr:"이 음식 이름이 뭐예요? 어떻게 먹어요?", rom:"イ ウムシン イルミ ムォエヨ？オットケ モゴヨ？", ja:"この料理の名前は何ですか？どうやって食べますか？"},
      vocab:[
        {kr:"비빔밥 / 삼겹살 / 김치", rom:"ピビンパプ／サムギョプサル／キムチ", ja:"ビビンバ／サムギョプサル／キムチ"},
        {kr:"맵다 / 짜다 / 달다", rom:"メプタ／ッチャダ／タルダ", ja:"辛い／しょっぱい／甘い"},
        {kr:"반찬", rom:"パンチャン", ja:"おかず（小皿料理）"},
        {kr:"더 먹을래요?", rom:"ト モグルレヨ？", ja:"もっと食べますか？"},
        {kr:"잘 먹었습니다", rom:"チャル モゴッスムニダ", ja:"ごちそうさまでした"},
      ],
      grammar:{point:"〜어/아 보다", ja:"〜してみる", example:"한번 먹어 봐요. (一度食べてみてください)"}
    }
  },
  { week:16, phase:1, theme:"Phase 1 総復習", topik:"TOPIK 1-2級確認",
    morning:{
      phrase:{kr:"처음보다 많이 늘었어요! 계속 열심히 해요.", rom:"チョウムボダ マニ ヌロッソヨ！ケソク ヨルシミ ヘヨ", ja:"最初より上達しました！引き続き頑張りましょう。"},
      vocab:[
        {kr:"실력이 늘다", rom:"シルリョギ ヌルダ", ja:"実力が上がる"},
        {kr:"복습하다", rom:"ポクスパダ", ja:"復習する"},
        {kr:"자신이 생기다", rom:"チャシニ センギダ", ja:"自信がつく"},
        {kr:"꾸준히", rom:"ックジュニ", ja:"コツコツと・継続的に"},
        {kr:"포기하지 마세요", rom:"ポギハジ マセヨ", ja:"諦めないでください"},
      ],
      grammar:{point:"〜보다 〜어요/아요", ja:"〜より〜です（比較）", example:"전보다 훨씬 잘해요. (前よりずっと上手です)"}
    }
  },

  // ── PHASE 2: 日常会話 ───────────────────────────────────
  { week:17, phase:2, theme:"약속・待ち合わせ", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"내일 시간 있어요? 같이 밥 먹어요.", rom:"ネイル シガン イッソヨ？カチ パブ モゴヨ", ja:"明日時間ありますか？一緒にご飯食べましょう。"},
      vocab:[
        {kr:"약속이 있어요", rom:"ヤクソギ イッソヨ", ja:"約束があります"},
        {kr:"몇 시에 만날까요?", rom:"ミョッ シエ マンナルッカヨ？", ja:"何時に会いましょうか？"},
        {kr:"어디서 만나요?", rom:"オディソ マンナヨ？", ja:"どこで会いますか？"},
        {kr:"늦을 것 같아요", rom:"ヌジュル ゴッ カタヨ", ja:"遅れそうです"},
        {kr:"취소할게요", rom:"チュィソハルケヨ", ja:"キャンセルします"},
      ],
      grammar:{point:"〜(으)ㄹ까요?", ja:"〜しましょうか？（提案）", example:"같이 영화 볼까요? (一緒に映画見ましょうか？)"}
    }
  },
  { week:18, phase:2, theme:"招待・おもてなし", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"저희 집에 초대하고 싶어요. 언제 시간 되세요?", rom:"チョイ チベ チョデハゴ シポヨ。オンジェ シガン テセヨ？", ja:"うちに招待したいです。いつ時間がありますか？"},
      vocab:[
        {kr:"어서 오세요!", rom:"オソ オセヨ！", ja:"いらっしゃい！"},
        {kr:"앉으세요", rom:"アンジュセヨ", ja:"お座りください"},
        {kr:"많이 드세요", rom:"マニ トゥセヨ", ja:"たくさん食べてください"},
        {kr:"편하게 있으세요", rom:"ピョナゲ イッスセヨ", ja:"楽にしてください"},
        {kr:"선물이에요", rom:"ソンムリエヨ", ja:"プレゼントです"},
      ],
      grammar:{point:"〜고 싶어요", ja:"〜したいです（希望）", example:"한국에 가고 싶어요. (韓国に行きたいです)"}
    }
  },
  { week:19, phase:2, theme:"病院・症状の説明", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"어제부터 기침이 나고 열이 있어요.", rom:"オジェブト キチミ ナゴ ヨリ イッソヨ", ja:"昨日から咳が出て熱があります。"},
      vocab:[
        {kr:"기침이 나다", rom:"キチミ ナダ", ja:"咳が出る"},
        {kr:"콧물이 나다", rom:"コンムリ ナダ", ja:"鼻水が出る"},
        {kr:"소화가 안 돼요", rom:"ソファガ アン テヨ", ja:"消化不良です"},
        {kr:"진찰해 주세요", rom:"チンチャレ チュセヨ", ja:"診察してください"},
        {kr:"알레르기가 있어요", rom:"アルレルギガ イッソヨ", ja:"アレルギーがあります"},
      ],
      grammar:{point:"〜부터 〜까지", ja:"〜から〜まで", example:"어제부터 오늘까지 아팠어요."}
    }
  },
  { week:20, phase:2, theme:"銀行・お金", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"통장을 만들고 싶어요. 뭐가 필요해요?", rom:"トンジャンウル マンドゥルゴ シポヨ。ムォガ ピリョヘヨ？", ja:"口座を作りたいです。何が必要ですか？"},
      vocab:[
        {kr:"환전하다", rom:"ファンジョナダ", ja:"両替する"},
        {kr:"송금하다", rom:"ソングマダ", ja:"送金する"},
        {kr:"잔액 조회", rom:"チャネク チョフェ", ja:"残高照会"},
        {kr:"비밀번호", rom:"ピミルボノ", ja:"暗証番号"},
        {kr:"이자율", rom:"イジャユル", ja:"金利"},
      ],
      grammar:{point:"〜(으)려면 〜이/가 필요해요", ja:"〜するには〜が必要です", example:"비자를 받으려면 여권이 필요해요."}
    }
  },
  { week:21, phase:2, theme:"郵便局・宅配", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"이 소포를 일본으로 보내고 싶어요.", rom:"イ ソポルル イルボヌロ ポネゴ シポヨ", ja:"この小包を日本に送りたいです。"},
      vocab:[
        {kr:"소포 / 편지", rom:"ソポ／ピョンジ", ja:"小包／手紙"},
        {kr:"등기 / 일반", rom:"トゥンギ／イルバン", ja:"書留／普通"},
        {kr:"며칠 걸려요?", rom:"ミョチル コルリョヨ？", ja:"何日かかりますか？"},
        {kr:"주소를 써 주세요", rom:"チュソルル ッソ チュセヨ", ja:"住所を書いてください"},
        {kr:"보험을 드릴까요?", rom:"ポホムル トゥリルッカヨ？", ja:"保険をかけますか？"},
      ],
      grammar:{point:"〜(으)로 보내다", ja:"〜へ送る", example:"한국으로 택배를 보냈어요."}
    }
  },
  { week:22, phase:2, theme:"美容室・ヘアスタイル", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"조금만 잘라 주세요. 파마는 안 해요.", rom:"チョグムマン チャルラ チュセヨ。パマヌン アン ヘヨ", ja:"少しだけ切ってください。パーマはいりません。"},
      vocab:[
        {kr:"머리를 자르다", rom:"モリルル チャルダ", ja:"髮を切る"},
        {kr:"염색하다", rom:"ヨムセカダ", ja:"染める"},
        {kr:"드라이해 주세요", rom:"トゥライヘ チュセヨ", ja:"ドライをしてください"},
        {kr:"앞머리", rom:"アンモリ", ja:"前髪"},
        {kr:"어떻게 해 드릴까요?", rom:"オットケ ヘ トゥリルッカヨ？", ja:"どのようにしましょうか？"},
      ],
      grammar:{point:"〜만 〜어/아 주세요", ja:"〜だけ〜してください", example:"조금만 잘라 주세요. (少しだけ切ってください)"}
    }
  },
  { week:23, phase:2, theme:"旅行・宿泊", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"체크인하고 싶어요. 예약했어요.", rom:"チェクイナゴ シポヨ。イェヤケッソヨ", ja:"チェックインしたいです。予約しました。"},
      vocab:[
        {kr:"예약 / 취소", rom:"イェヤク／チュィソ", ja:"予約／キャンセル"},
        {kr:"빈방 있어요?", rom:"ピンバン イッソヨ？", ja:"空き部屋はありますか？"},
        {kr:"조식 포함이에요?", rom:"チョシク ポハミエヨ？", ja:"朝食込みですか？"},
        {kr:"짐을 맡아 주세요", rom:"チムル マタ チュセヨ", ja:"荷物を預けてください"},
        {kr:"와이파이 비밀번호가 뭐예요?", rom:"ワイパイ ピミルボノガ ムォエヨ？", ja:"WiFiのパスワードは何ですか？"},
      ],
      grammar:{point:"〜았/었어요（過去形）", ja:"〜しました", example:"예약했어요. ／ 갔어요. ／ 먹었어요."}
    }
  },
  { week:24, phase:2, theme:"観光・名所", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"경복궁에 가 보셨어요? 꼭 가 보세요!", rom:"キョンボックンエ カ ボショッソヨ？ック カ ボセヨ！", ja:"景福宮に行ったことがありますか？ぜひ行ってみてください！"},
      vocab:[
        {kr:"유명한 곳", rom:"ユミョンハン ゴッ", ja:"有名な場所"},
        {kr:"입장료", rom:"イプチャンニョ", ja:"入場料"},
        {kr:"사진 찍어도 돼요?", rom:"サジン チゴド テヨ？", ja:"写真を撮ってもいいですか？"},
        {kr:"안내 지도", rom:"アンネ チド", ja:"案内地図"},
        {kr:"이게 뭐예요?", rom:"イゲ ムォエヨ？", ja:"これは何ですか？"},
      ],
      grammar:{point:"〜아/어 보다（経験）", ja:"〜したことがある", example:"서울에 가 봤어요. (ソウルに行ったことがあります)"}
    }
  },
  { week:25, phase:2, theme:"天気と体調", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"요즘 환절기라 감기에 걸리기 쉬워요.", rom:"ヨジュム ファンジョルギラ カムギエ コルリギ シュウォヨ", ja:"最近は季節の変わり目なので風邪をひきやすいです。"},
      vocab:[
        {kr:"감기에 걸리다", rom:"カムギエ コルリダ", ja:"風邪をひく"},
        {kr:"환절기", rom:"ファンジョルギ", ja:"季節の変わり目"},
        {kr:"두꺼운 옷을 입다", rom:"トゥッコウン オスル イプタ", ja:"厚着をする"},
        {kr:"건강을 챙기다", rom:"コンガンウル チェンギダ", ja:"健康に気を使う"},
        {kr:"푹 쉬다", rom:"プク シダ", ja:"ゆっくり休む"},
      ],
      grammar:{point:"〜기 쉽다/어렵다", ja:"〜しやすい／しにくい", example:"한국어는 배우기 어려워요. (韓国語は学びにくいです)"}
    }
  },
  { week:26, phase:2, theme:"家・インテリア", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"저희 집은 아파트예요. 방이 세 개 있어요.", rom:"チョイ チブン アパトゥエヨ。パンイ セ ゲ イッソヨ", ja:"うちはマンションです。部屋が3つあります。"},
      vocab:[
        {kr:"아파트 / 주택", rom:"アパトゥ／チュテク", ja:"マンション／一軒家"},
        {kr:"거실 / 주방 / 욕실", rom:"コシル／チュバン／ヨクシル", ja:"リビング／キッチン／浴室"},
        {kr:"청소하다 / 정리하다", rom:"チョンソハダ／チョンニハダ", ja:"掃除する／片付ける"},
        {kr:"월세 / 전세", rom:"ウォルセ／チョンセ", ja:"月払い家賃／チョンセ（韓国独自）"},
        {kr:"이사하다", rom:"イサハダ", ja:"引越しする"},
      ],
      grammar:{point:"〜(이)나 / 〜도", ja:"〜や〜も", example:"방이 세 개나 있어요. (部屋が3つもあります)"}
    }
  },
  { week:27, phase:2, theme:"職場・仕事", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"회의가 있어서 늦을 것 같아요. 먼저 시작하세요.", rom:"フェイガ イッソソ ヌジュル ゴッ カタヨ。モンジョ シジャカセヨ", ja:"会議があって遅れそうです。先に始めてください。"},
      vocab:[
        {kr:"회의 / 보고서", rom:"フェイ／ポゴソ", ja:"会議／報告書"},
        {kr:"마감일", rom:"マガミル", ja:"締め切り日"},
        {kr:"야근하다", rom:"ヤグナダ", ja:"残業する"},
        {kr:"출장", rom:"チュルジャン", ja:"出張"},
        {kr:"연차 / 휴가", rom:"ヨンチャ／ヒュガ", ja:"有給／休暇"},
      ],
      grammar:{point:"〜아/어서", ja:"〜なので・〜して（理由・順序）", example:"회의가 있어서 못 갔어요."}
    }
  },
  { week:28, phase:2, theme:"쇼핑몰・インターネット", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"반품하고 싶어요. 사이즈가 안 맞아요.", rom:"パンプマゴ シポヨ。サイジュガ アン マジャヨ", ja:"返品したいです。サイズが合いません。"},
      vocab:[
        {kr:"교환 / 반품 / 환불", rom:"キョファン／パンプム／ファンブル", ja:"交換／返品／返金"},
        {kr:"사이즈가 작아요/커요", rom:"サイジュガ チャガヨ／コヨ", ja:"サイズが小さい／大きい"},
        {kr:"온라인 쇼핑", rom:"オルライン ショピン", ja:"オンラインショッピング"},
        {kr:"배송비", rom:"ペソンビ", ja:"送料"},
        {kr:"후기", rom:"フギ", ja:"レビュー"},
      ],
      grammar:{point:"〜(으)면 안 돼요", ja:"〜してはいけません", example:"여기서 사진 찍으면 안 돼요."}
    }
  },
  { week:29, phase:2, theme:"韓国の行事・文化", topik:"TOPIK 2-3級準備",
    morning:{
      phrase:{kr:"추석에는 온 가족이 모여요. 차례를 지내요.", rom:"チュソゲヌン オン カジョギ モヨヨ。チャレルル チネヨ", ja:"チュソクには家族全員が集まります。祭祀を行います。"},
      vocab:[
        {kr:"설날 / 추석", rom:"ソルラル／チュソク", ja:"旧正月／秋夕（お盆）"},
        {kr:"차례 / 성묘", rom:"チャレ／ソンミョ", ja:"祭祀／お墓参り"},
        {kr:"한복을 입다", rom:"ハンボグル イプタ", ja:"韓服を着る"},
        {kr:"세배하다", rom:"セベハダ", ja:"年始の挨拶（お辞儀）をする"},
        {kr:"세뱃돈", rom:"セベットン", ja:"お年玉"},
      ],
      grammar:{point:"〜(으)면", ja:"〜すれば・〜したら（条件）", example:"시간이 있으면 같이 가요."}
    }
  },
  { week:30, phase:2, theme:"ニュース・社会の話題（入門）", topik:"TOPIK 3級準備",
    morning:{
      phrase:{kr:"요즘 물가가 많이 올랐어요. 생활비가 부담돼요.", rom:"ヨジュム ムルガガ マニ オルラッソヨ。センファルビガ プダムドェヨ", ja:"最近物価がだいぶ上がりました。生活費が負担です。"},
      vocab:[
        {kr:"물가 / 경제", rom:"ムルガ／キョンジェ", ja:"物価／経済"},
        {kr:"뉴스 / 신문", rom:"ニュス／シンムン", ja:"ニュース／新聞"},
        {kr:"사건 / 사고", rom:"サゴン／サゴ", ja:"事件／事故"},
        {kr:"정부 / 정책", rom:"チョンブ／チョンチェク", ja:"政府／政策"},
        {kr:"부담이 되다", rom:"プダミ テダ", ja:"負担になる"},
      ],
      grammar:{point:"〜아/어졌어요", ja:"〜になりました（変化）", example:"물가가 올랐어요. ／ 날씨가 따뜻해졌어요."}
    }
  },
  { week:31, phase:2, theme:"意見・感想を言う", topik:"TOPIK 3級準備",
    morning:{
      phrase:{kr:"제 생각에는 이게 더 좋을 것 같아요.", rom:"チェ センガゲヌン イゲ ト チョウル ゴッ カタヨ", ja:"私の考えでは、こちらの方がいいと思います。"},
      vocab:[
        {kr:"제 생각에는", rom:"チェ センガゲヌン", ja:"私の考えでは"},
        {kr:"찬성 / 반대", rom:"チャンソン／パンデ", ja:"賛成／反対"},
        {kr:"장점 / 단점", rom:"チャンジョム／タンジョム", ja:"長所／短所"},
        {kr:"솔직히 말하면", rom:"ソルチキ マラミョン", ja:"正直に言うと"},
        {kr:"아무래도", rom:"アムラド", ja:"どうしても・やはり"},
      ],
      grammar:{point:"〜(으)ㄴ/는 것 같아요", ja:"〜だと思います（推測・意見）", example:"그게 더 나은 것 같아요."}
    }
  },
  { week:32, phase:2, theme:"Phase 2 総復習", topik:"TOPIK 2-3級確認",
    morning:{
      phrase:{kr:"4개월째예요! 정말 많이 늘었어요. 자랑스러워요.", rom:"ネゲウォルチェエヨ！チョンマル マニ ヌロッソヨ。チャランスロウォヨ", ja:"4か月目です！本当に上達しました。誇らしいです。"},
      vocab:[
        {kr:"진심으로", rom:"チンシムロ", ja:"心から・本気で"},
        {kr:"목표를 세우다", rom:"モクピョルル セウダ", ja:"目標を立てる"},
        {kr:"성취감", rom:"ソンチュィガム", ja:"達成感"},
        {kr:"꾸준히 하다", rom:"ックジュニ ハダ", ja:"コツコツ続ける"},
        {kr:"이제 반이에요", rom:"イジェ パニエヨ", ja:"もう半分です"},
      ],
      grammar:{point:"〜(으)ㄴ 지 〜됐어요", ja:"〜してから〜になりました", example:"공부한 지 4개월 됐어요."}
    }
  },

  // ── PHASE 3: 発展 ───────────────────────────────────────
  { week:33, phase:3, theme:"敬語（尊敬語）", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"어르신, 어디 가세요? 제가 도와드릴까요?", rom:"オルシン、オディ カセヨ？チェガ トワドゥリルッカヨ？", ja:"お年寄りの方、どちらへ行かれますか？お手伝いしましょうか？"},
      vocab:[
        {kr:"계시다（있다の尊敬）", rom:"ケシダ", ja:"いらっしゃる"},
        {kr:"드시다（먹다の尊敬）", rom:"トゥシダ", ja:"召し上がる"},
        {kr:"주무시다（자다の尊敬）", rom:"チュムシダ", ja:"お休みになる"},
        {kr:"말씀하시다", rom:"マルスマシダ", ja:"おっしゃる"},
        {kr:"어르신", rom:"オルシン", ja:"目上の方・お年寄り"},
      ],
      grammar:{point:"〜시〜 （尊敬の語尾）", ja:"〜される（尊敬表現）", example:"선생님이 오셨어요. (先生がいらっしゃいました)"}
    }
  },
  { week:34, phase:3, theme:"謙譲語・丁寧な依頼", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"죄송하지만 잠깐 봐 주실 수 있으세요?", rom:"チェソンハジマン チャムカン ポ チュシル ス イッスセヨ？", ja:"恐れ入りますが、少し見ていただけますか？"},
      vocab:[
        {kr:"죄송하지만", rom:"チェソンハジマン", ja:"恐れ入りますが"},
        {kr:"실례지만", rom:"シルレジマン", ja:"失礼ですが"},
        {kr:"혹시", rom:"ホクシ", ja:"もしかして・念のため"},
        {kr:"부탁드려도 될까요?", rom:"プタットゥリョド テルッカヨ？", ja:"お願いしてもよろしいですか？"},
        {kr:"감사히 받겠습니다", rom:"カムサヒ パッケッスムニダ", ja:"ありがたく頂戴します"},
      ],
      grammar:{point:"〜아/어 주실 수 있으세요?", ja:"〜していただけますか？（丁寧依頼）", example:"도와주실 수 있으세요?"}
    }
  },
  { week:35, phase:3, theme:"接続詞・文のつなぎ方", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"열심히 했지만 결과가 좋지 않았어요. 그래도 포기 안 해요.", rom:"ヨルシミ ヘッチマン キョルグァガ チョチ アナッソヨ。クレド ポギ アン ヘヨ", ja:"一生懸命やりましたが結果がよくなかったです。それでも諦めません。"},
      vocab:[
        {kr:"그래서 / 그러므로", rom:"クレソ／クロムロ", ja:"だから／それゆえに"},
        {kr:"그러나 / 하지만", rom:"クロナ／ハジマン", ja:"しかし／でも"},
        {kr:"그리고 / 또한", rom:"クリゴ／トハン", ja:"そして／また"},
        {kr:"그래도", rom:"クレド", ja:"それでも"},
        {kr:"왜냐하면", rom:"ウェニャハミョン", ja:"なぜなら"},
      ],
      grammar:{point:"〜지만", ja:"〜だが・〜けれど", example:"어렵지만 재미있어요. (難しいけど面白いです)"}
    }
  },
  { week:36, phase:3, theme:"理由・原因の表現", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"피곤한 탓에 실수를 했어요. 다음엔 조심할게요.", rom:"ピゴナン タスエ シルスルル ヘッソヨ。タウメン チョシマルケヨ", ja:"疲れのせいでミスをしました。次は気を付けます。"},
      vocab:[
        {kr:"탓에 / 덕분에", rom:"タスエ／トクブネ", ja:"〜のせいで／〜のおかげで"},
        {kr:"때문에", rom:"テムネ", ja:"〜のために（理由）"},
        {kr:"으로 인해", rom:"ウロ インヘ", ja:"〜によって"},
        {kr:"실수하다 / 조심하다", rom:"シルスハダ／チョシマダ", ja:"ミスする／気を付ける"},
        {kr:"원인 / 결과", rom:"ウォニン／キョルグァ", ja:"原因／結果"},
      ],
      grammar:{point:"〜(으)ㄴ/는 탓에", ja:"〜のせいで（否定的理由）", example:"비가 온 탓에 행사가 취소됐어요."}
    }
  },
  { week:37, phase:3, theme:"推量・仮定の表現", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"그 사람이 아마 거절할 것 같은데요.", rom:"ク サラミ アマ コジョラル ゴッ カトゥンデヨ", ja:"その人はたぶん断りそうですね。"},
      vocab:[
        {kr:"아마 / 아마도", rom:"アマ／アマド", ja:"たぶん・おそらく"},
        {kr:"혹시 ~(으)면", rom:"ホクシ〜(ウ)ミョン", ja:"もしかして〜したら"},
        {kr:"만약", rom:"マニャク", ja:"もし"},
        {kr:"~는지 모르겠어요", rom:"〜ヌンジ モルゲッソヨ", ja:"〜かどうかわかりません"},
        {kr:"거절하다 / 수락하다", rom:"コジョラダ／スラカダ", ja:"断る／受け入れる"},
      ],
      grammar:{point:"〜(으)ㄹ 텐데요", ja:"〜でしょうに・〜のはずですが", example:"힘들 텐데 고생이 많아요."}
    }
  },
  { week:38, phase:3, theme:"受け身・使役", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"차가 막혀서 늦었어요. 기다리게 해서 죄송해요.", rom:"チャガ マキョソ ヌジョッソヨ。キダリゲ ヘソ チェソンヘヨ", ja:"渋滞で遅れました。お待たせしてすみません。"},
      vocab:[
        {kr:"막히다（受け身）", rom:"マキダ", ja:"막다（塞ぐ）の受け身→詰まる"},
        {kr:"만들어지다", rom:"マンドゥロジダ", ja:"作られる"},
        {kr:"기다리게 하다（使役）", rom:"キダリゲ ハダ", ja:"待たせる"},
        {kr:"~게 만들다", rom:"〜ゲ マンドゥルダ", ja:"〜させる・〜にする"},
        {kr:"피해를 주다", rom:"ピヘルル チュダ", ja:"迷惑をかける"},
      ],
      grammar:{point:"〜히/리/기/이다（受け身）", ja:"〜される", example:"문이 닫혀 있어요. (ドアが閉まっています)"}
    }
  },
  { week:39, phase:3, theme:"比較・程度の表現", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"작년보다 훨씬 자연스러워졌어요.", rom:"チャンニョンボダ ファルシン チャヨンスロウォジョッソヨ", ja:"去年よりずっと自然になりました。"},
      vocab:[
        {kr:"훨씬 / 더 / 덜", rom:"ファルシン／ト／トル", ja:"ずっと／もっと／もっと少なく"},
        {kr:"가장 / 제일", rom:"カジャン／チェイル", ja:"最も（一番）"},
        {kr:"얼마나 ~(으)ㄴ지", rom:"オルマナ〜(ウ)ンジ", ja:"どれほど〜か"},
        {kr:"비슷하다 / 다르다", rom:"ピスタダ／タルダ", ja:"似ている／違う"},
        {kr:"몇 배나", rom:"ミョッ ペナ", ja:"何倍も"},
      ],
      grammar:{point:"〜보다 〜(으)ㄴ/더", ja:"〜より〜です（比較）", example:"한국어가 일본어보다 어려워요."}
    }
  },
  { week:40, phase:3, theme:"韓国語の慣用句・ことわざ", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"발이 넓다고요? 아는 사람이 참 많군요!", rom:"パリ ノルタゴヨ？アヌン サラミ チャム マンクンニョ！", ja:"「足が広い」？知り合いがたくさんいるんですね！"},
      vocab:[
        {kr:"발이 넓다", rom:"パリ ノルダ", ja:"顔が広い（足が広い）"},
        {kr:"귀가 얇다", rom:"クィガ ヤルタ", ja:"お人好し（耳が薄い）"},
        {kr:"손이 크다", rom:"ソニ クダ", ja:"太っ腹（手が大きい）"},
        {kr:"눈이 높다", rom:"ヌニ ノプタ", ja:"目が高い・高望みする"},
        {kr:"배가 아프다", rom:"ペガ アプダ", ja:"妬む（お腹が痛い）"},
      ],
      grammar:{point:"〜다고요?（確認・驚き）", ja:"〜だと言うんですか？", example:"한국어를 1년 만에 배웠다고요?!"}
    }
  },
  { week:41, phase:3, theme:"メディア・SNS・趣味深化", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"요즘 유튜브로 한국어 공부하고 있어요. 도움이 많이 돼요.", rom:"ヨジュム ユトゥブロ ハングゴ コンブハゴ イッソヨ。トウミ マニ テヨ", ja:"最近YouTubeで韓国語を勉強しています。とても役立っています。"},
      vocab:[
        {kr:"구독하다 / 댓글 달다", rom:"クドカダ／テックル タルダ", ja:"チャンネル登録する／コメントする"},
        {kr:"알고리즘", rom:"アルゴリジュム", ja:"アルゴリズム"},
        {kr:"인플루언서", rom:"インプルウォンソ", ja:"インフルエンサー"},
        {kr:"라이브 방송", rom:"ライブ パンソン", ja:"ライブ配信"},
        {kr:"바이럴", rom:"パイロル", ja:"バイラル（口コミ拡散）"},
      ],
      grammar:{point:"〜(으)로", ja:"〜で（手段・方法）", example:"카카오톡으로 연락해요. (カカオトークで連絡します)"}
    }
  },
  { week:42, phase:3, theme:"環境・社会問題", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"환경 문제가 심각해요. 일상에서 실천할 수 있는 게 있어요.", rom:"ファンギョン ムンジェガ シムガケヨ。イルサンエソ シルチョナル ス インヌン ゲ イッソヨ", ja:"環境問題が深刻です。日常でできることがあります。"},
      vocab:[
        {kr:"지구 온난화", rom:"チグ オンナナ", ja:"地球温暖化"},
        {kr:"분리수거하다", rom:"プルリスゴハダ", ja:"分別ゴミを出す"},
        {kr:"일회용품", rom:"イルフェヨングム", ja:"使い捨て製品"},
        {kr:"탄소 발자국", rom:"タンソ パルチャグク", ja:"カーボンフットプリント"},
        {kr:"지속 가능한", rom:"チジョク カヌンハン", ja:"持続可能な"},
      ],
      grammar:{point:"〜(으)ㄹ 수 있어요/없어요", ja:"〜できます／できません", example:"매일 실천할 수 있어요."}
    }
  },
  { week:43, phase:3, theme:"説得・交渉の表現", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"한번 더 생각해 보시겠어요? 이쪽이 더 유리해요.", rom:"ハンボン ト センガケ ポシゲッソヨ？イッチョギ ト ユリヘヨ", ja:"もう一度考えてみてもらえますか？こちらの方がお得です。"},
      vocab:[
        {kr:"설득하다 / 협상하다", rom:"ソルトゥカダ／ヒョプサンハダ", ja:"説得する／交渉する"},
        {kr:"유리하다 / 불리하다", rom:"ユリハダ／プルリハダ", ja:"有利だ／不利だ"},
        {kr:"대신에", rom:"テシネ", ja:"代わりに"},
        {kr:"합리적인", rom:"ハムニジョギン", ja:"合理的な"},
        {kr:"타협점", rom:"タヒョプチョム", ja:"妥協点"},
      ],
      grammar:{point:"〜(으)시겠어요?（丁寧な提案）", ja:"〜なさいますか？", example:"한번 더 확인해 보시겠어요?"}
    }
  },
  { week:44, phase:3, theme:"メール・フォーマルな文章", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"안녕하십니까? 귀사의 무궁한 발전을 기원합니다.", rom:"アンニョンハシムニッカ？クィサイ ムグンハン パルジョヌル キウォンハムニダ", ja:"こんにちは。貴社のご発展をお祈りします。"},
      vocab:[
        {kr:"안녕하십니까", rom:"アンニョンハシムニッカ", ja:"こんにちは（フォーマル）"},
        {kr:"귀사 / 폐사", rom:"クィサ／ペサ", ja:"貴社／弊社"},
        {kr:"첨부 파일", rom:"チョムブ パイル", ja:"添付ファイル"},
        {kr:"회신 부탁드립니다", rom:"フェシン プタットゥリムニダ", ja:"ご返信よろしくお願いします"},
        {kr:"이상입니다", rom:"イサンイムニダ", ja:"以上です"},
      ],
      grammar:{point:"〜습니다/ㅂ니다（ハムニダ体）", ja:"フォーマルな丁寧体", example:"회의는 내일 있습니다. (会議は明日あります)"}
    }
  },
  { week:45, phase:3, theme:"映画・文学の表現", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"그 영화 주제가 깊어서 오래 생각하게 됐어요.", rom:"ク ヨンファ チュジェガ キポソ オレ センガカゲ テッソヨ", ja:"その映画のテーマが深くて、長く考えさせられました。"},
      vocab:[
        {kr:"주제 / 소재", rom:"チュジェ／ソジェ", ja:"テーマ／素材"},
        {kr:"감동적이다", rom:"カムドンジョギダ", ja:"感動的だ"},
        {kr:"반전이 있다", rom:"パンジョニ イッタ", ja:"どんでん返しがある"},
        {kr:"현실적이다", rom:"ヒョンシルジョギダ", ja:"現実的だ"},
        {kr:"여운이 남다", rom:"ヨウニ ナムダ", ja:"余韻が残る"},
      ],
      grammar:{point:"〜게 되다", ja:"〜するようになる・〜させられる", example:"한국어를 좋아하게 됐어요. (韓国語が好きになりました)"}
    }
  },
  { week:46, phase:3, theme:"義父母との会話", topik:"TOPIK 3-4級準備",
    morning:{
      phrase:{kr:"장인어른, 건강은 어떠세요? 오래오래 건강하게 지내세요.", rom:"チャンイノルン、コンガンウン オットセヨ？オレオレ コンガンハゲ チネセヨ", ja:"お義父さん、お加減はいかがですか？ずっとお元気でいてください。"},
      vocab:[
        {kr:"어떻게 지내셨어요?", rom:"オットケ チネショッソヨ？", ja:"いかがお過ごしでしたか？"},
        {kr:"덕분에 잘 지냈어요", rom:"トクブネ チャル チネッソヨ", ja:"おかげさまで元気でした"},
        {kr:"많이 드세요", rom:"マニ トゥセヨ", ja:"たくさん召し上がってください"},
        {kr:"제가 할게요", rom:"チェガ ハルケヨ", ja:"私がやります"},
        {kr:"오래 사세요", rom:"オレ サセヨ", ja:"長生きしてください"},
      ],
      grammar:{point:"〜(으)세요（尊敬命令）", ja:"〜してください（尊敬）", example:"여기 앉으세요. ／ 많이 드세요."}
    }
  },
  { week:47, phase:3, theme:"韓国の歴史・地理（読解対策）", topik:"TOPIK 4級準備",
    morning:{
      phrase:{kr:"한국은 반도 국가로 삼면이 바다로 둘러싸여 있어요.", rom:"ハンググン パンド クッカロ サムミョニ パダロ トゥルロッサヨ イッソヨ", ja:"韓国は半島国家で、三方が海に囲まれています。"},
      vocab:[
        {kr:"반도 / 섬", rom:"パンド／ソム", ja:"半島／島"},
        {kr:"인구 / 면적", rom:"インク／ミョンジョク", ja:"人口／面積"},
        {kr:"수도 / 지방", rom:"スド／チバン", ja:"首都／地方"},
        {kr:"역사적으로", rom:"ヨクサジョグロ", ja:"歴史的に"},
        {kr:"문화유산", rom:"ムンファユサン", ja:"文化遺産"},
      ],
      grammar:{point:"〜로/으로 둘러싸이다", ja:"〜に囲まれる", example:"산으로 둘러싸인 도시예요."}
    }
  },
  { week:48, phase:3, theme:"Phase 3 総復習", topik:"TOPIK 3-4級確認",
    morning:{
      phrase:{kr:"9개월이나 됐어요! 이제 진짜 TOPIK 4급 도전이에요!", rom:"クゲウォリナ テッソヨ！イジェ チンッチャ トピク サグプ トジョニエヨ！", ja:"9か月になりました！いよいよ本当のTOPIK 4級への挑戦です！"},
      vocab:[
        {kr:"도전하다", rom:"トジョナダ", ja:"挑戦する"},
        {kr:"자신감", rom:"チャシンガム", ja:"自信"},
        {kr:"극복하다", rom:"クッポカダ", ja:"克服する"},
        {kr:"실력을 발휘하다", rom:"シルリョグル パルフィハダ", ja:"実力を発揮する"},
        {kr:"결과에 만족하다", rom:"キョルグァエ マンジョカダ", ja:"結果に満足する"},
      ],
      grammar:{point:"〜(으)ㄴ/는/ㄹ 데（複合語尾）", ja:"〜なのに・〜するところ", example:"잘 하는데 자신감이 없어요. (上手なのに自信がないんです)"}
    }
  },

  // ── PHASE 4: TOPIK 4級仕上げ ──────────────────────────
  { week:49, phase:4, theme:"TOPIK対策：語彙強化", topik:"TOPIK 4級直前",
    morning:{
      phrase:{kr:"어휘가 부족하면 독해가 어려워요. 매일 10개씩 외워요.", rom:"オフィガ プジョカミョン トケガ オリョウォヨ。メイル ヨルゲッシク オウォヨ", ja:"語彙が不足すると読解が難しいです。毎日10個ずつ覚えましょう。"},
      vocab:[
        {kr:"어휘 / 독해", rom:"オフィ／トケ", ja:"語彙／読解"},
        {kr:"추론하다", rom:"チュロナダ", ja:"推論する"},
        {kr:"파악하다", rom:"パアカダ", ja:"把握する"},
        {kr:"논리적", rom:"ノルリジョク", ja:"論理的"},
        {kr:"핵심", rom:"ヘクシム", ja:"核心・ポイント"},
      ],
      grammar:{point:"TOPIK頻出：〜에 따라", ja:"〜に従って・〜によって", example:"상황에 따라 다를 수 있어요."}
    }
  },
  { week:50, phase:4, theme:"TOPIK対策：読解・文法", topik:"TOPIK 4級直前",
    morning:{
      phrase:{kr:"글의 중심 생각이 뭔지 파악하는 게 중요해요.", rom:"クルイ チュンシム センガギ ムォンジ パアカヌン ゲ チュンヨヘヨ", ja:"文章の中心的な考えが何かを把握することが大切です。"},
      vocab:[
        {kr:"중심 생각", rom:"チュンシム センガク", ja:"中心的な考え"},
        {kr:"문맥", rom:"ムンメク", ja:"文脈"},
        {kr:"함축적", rom:"ハムチュクチョク", ja:"含蓄的な"},
        {kr:"반박하다", rom:"パンバカダ", ja:"反論する"},
        {kr:"주장하다", rom:"チュジャンハダ", ja:"主張する"},
      ],
      grammar:{point:"TOPIK頻出：〜에 불구하고", ja:"〜にもかかわらず", example:"어려움에 불구하고 포기하지 않았어요."}
    }
  },
  { week:51, phase:4, theme:"TOPIK対策：聞き取り強化", topik:"TOPIK 4級直前",
    morning:{
      phrase:{kr:"빠른 속도의 대화도 이해하려면 많이 들어야 해요.", rom:"ッパルン ソクドイ テファド イヘハリョミョン マニ トゥロヤ ヘヨ", ja:"速いスピードの会話も理解するには、たくさん聞かなければなりません。"},
      vocab:[
        {kr:"속도 / 발음", rom:"ソクト／パルム", ja:"速度／発音"},
        {kr:"들리다 / 알아듣다", rom:"トゥルリダ／アラトゥッタ", ja:"聞こえる／聞き取る"},
        {kr:"내용 파악", rom:"ネヨン パアク", ja:"内容の把握"},
        {kr:"집중하다", rom:"チプチュンハダ", ja:"集中する"},
        {kr:"요점 정리", rom:"ヨジョム チョンニ", ja:"要点整理"},
      ],
      grammar:{point:"TOPIK頻出：〜아/어야 하다", ja:"〜しなければならない", example:"매일 연습해야 해요."}
    }
  },
  { week:52, phase:4, theme:"🎉 1年間の集大成！", topik:"TOPIK 4級チャレンジ",
    morning:{
      phrase:{kr:"드디어 1년이에요! 처음엔 몰랐는데 이제 많이 알아요. 수고했어요!", rom:"トゥディオ イルリョニエヨ！チョウメン モルランヌンデ イジェ マニ アラヨ。スゴヘッソヨ！", ja:"ついに1年です！最初は知らなかったけど今はたくさん知っています。お疲れさまでした！"},
      vocab:[
        {kr:"드디어", rom:"トゥディオ", ja:"ついに・とうとう"},
        {kr:"수고했어요", rom:"スゴヘッソヨ", ja:"お疲れさまでした"},
        {kr:"성장하다", rom:"ソンジャンハダ", ja:"成長する"},
        {kr:"자랑스럽다", rom:"チャランスロプタ", ja:"誇らしい"},
        {kr:"앞으로도 계속", rom:"アプロド ケソク", ja:"これからも続けて"},
      ],
      grammar:{point:"〜(으)ㄹ 수 있게 됐어요", ja:"〜できるようになりました", example:"한국어로 이야기할 수 있게 됐어요！"}
    }
  },
];

// ─── TOPIK LEVELS ────────────────────────────────────────────────────────────
// 全週の単語プール（クイズの選択肢用）
const ALL_VOCAB = CURRICULUM.flatMap(w => w.morning.vocab);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOPIK_LEVELS = [
  { level:"1級", range:[0,15], color:"#94a3b8" },
  { level:"2級", range:[15,30], color:"#60a5fa" },
  { level:"3級", range:[30,55], color:"#34d399" },
  { level:"4級", range:[55,85], color:"#f59e0b" },
  { level:"4級達成!", range:[85,100], color:"#f97316" },
];

const PHASE_LABELS = ["", "Phase 1\n基礎", "Phase 2\n日常", "Phase 3\n発展", "Phase 4\n仕上げ"];
const PHASE_COLORS = ["", "#60a5fa", "#34d399", "#f59e0b", "#f97316"];

// ─── STORAGE ─────────────────────────────────────────────────────────────────
function loadState() {
  try { const s = localStorage.getItem("hiroshi-kr-v4"); return s ? JSON.parse(s) : null; } catch { return null; }
}
function saveState(s) {
  try { localStorage.setItem("hiroshi-kr-v4", JSON.stringify(s)); } catch {}
}

// ─── CLAUDE API ──────────────────────────────────────────────────────────────
async function askTutor(messages, lesson) {
  const sys = `あなたは韓国語スピーキングコーチです。
学習者：日本人男性（ひろし）、目標：韓国人の妻の家族と話せること。
今週のテーマ：「${lesson.theme}」（${lesson.topik}）

【練習の構成】
毎回のターンは必ず次の2種類のどちらかで終わること：

▼ リピート練習（新しいフレーズを覚えるとき）
- 短い解説（1〜2文）を日本語で書く
- 🗣 リピート: （声に出してほしい韓国語1文） ← この行を必ず最後に書く
- 🔊: （同じ韓国語） ← 音声再生用タグ

▼ 応答練習（フレーズが定着してきたとき）
- 韓国語で質問する（カタカナ読み＝日本語訳を添える）
- 💭 ヒント: （日本語でどう答えればいいか1文）
- 🔊: （質問文の韓国語） ← 音声再生用タグ

【共通ルール】
- 誤りはやさしく訂正し正しい表現を示す
- 今週の単語・テーマを使う
- 最初の2ターンはリピート練習、その後は応答練習を混ぜる
- 🔊: タグは必ず最後の行に1つだけ書く`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  try {
    // /api/chat = Vercelサーバーレス関数（APIキーを安全に管理）
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: sys, messages }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const d = await res.json();

    if (!res.ok) {
      return `⚠️ APIエラー (${res.status})：${d.error || "サーバーエラー"}`;
    }
    if (d.error) {
      return `⚠️ APIエラー：${d.error}`;
    }

    return d.content?.[0]?.text || "⚠️ 応答が空でした。";

  } catch (e) {
    clearTimeout(timer);
    if (e.name === "AbortError") {
      return "⚠️ タイムアウト（25秒）：ネットワーク接続を確認してください。";
    }
    return `⚠️ 通信エラー：${e.message}`;
  }
}

// ─── TTS ─────────────────────────────────────────────────────────────────────
// 🔊: タグ付き行から練習フレーズを抽出（なければ韓国語文字のみ）
function extractTTSPhrase(text) {
  const tagged = text.match(/🔊:\s*(.+)/);
  if (tagged) return tagged[1].trim();
  // フォールバック：韓国語文字のみ抽出
  const matches = text.match(/[\uAC00-\uD7A3][\uAC00-\uD7A3\s]*[\uAC00-\uD7A3]/g) || [];
  return matches[0]?.trim() || "";
}

function getKoreanVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find(v => v.lang === "ko-KR" && v.localService) ||
    voices.find(v => v.lang === "ko-KR") ||
    voices.find(v => v.lang.startsWith("ko")) ||
    null
  );
}

function speakKorean(text) {
  window.speechSynthesis.cancel();
  const phrase = extractTTSPhrase(text);
  if (!phrase) return;
  const speak = () => {
    const u = new SpeechSynthesisUtterance(phrase);
    const voice = getKoreanVoice();
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    else { u.lang = "ko-KR"; }
    u.rate = 0.85; u.pitch = 1.0;
    window.speechSynthesis.speak(u);
  };
  if (window.speechSynthesis.getVoices().length > 0) {
    speak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => { speak(); window.speechSynthesis.onvoiceschanged = null; };
  }
}

// 複数の単語・文を順番に読み上げる
// ／ , 、 改行 などの区切りに全対応
function speakKoreanAll(text) {
  window.speechSynthesis.cancel();
  const parts = text.split(/／|、|,\s*|\n/);
  const phrases = parts
    .map(p => (p.match(/[\uAC00-\uD7A3]+/g) || []).join("").trim())
    .filter(Boolean);
  if (!phrases.length) return;

  const speak = () => {
    const voice = getKoreanVoice();
    phrases.forEach(phrase => {
      const u = new SpeechSynthesisUtterance(phrase);
      if (voice) { u.voice = voice; u.lang = voice.lang; }
      else { u.lang = "ko-KR"; }
      u.rate = 0.85; u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    });
  };

  if (window.speechSynthesis.getVoices().length > 0) speak();
  else { window.speechSynthesis.onvoiceschanged = () => { speak(); window.speechSynthesis.onvoiceschanged = null; }; }
}

// 単語カード用：見出し語を全て読む（speakKoreanAllのエイリアス）
const speakVocab = speakKoreanAll;

// 韓国語音声が利用可能か確認するフック
function useKoreanVoiceCheck() {
  const [hasKoreanVoice, setHasKoreanVoice] = useState(null);
  useEffect(() => {
    const check = () => {
      const voices = window.speechSynthesis.getVoices();
      setHasKoreanVoice(voices.some(v => v.lang.startsWith("ko")));
    };
    check();
    window.speechSynthesis.onvoiceschanged = check;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);
  return hasKoreanVoice;
}

// ─── VOICE HOOK（トグル方式）────────────────────────────────────────────────
function useVoice({ onResult, onError }) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const isListening = useRef(false);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const toggle = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    if (isListening.current) {
      // 録音中 → 停止（onendで結果が来る）
      isListening.current = false;
      setListening(false);
      return;
    }

    // 毎回新しいインスタンスを生成（Chrome では再利用不可）
    const r = new SR();
    r.lang = "ko-KR";
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.continuous = false;

    r.onstart = () => {
      setListening(true);
      isListening.current = true;
      setErrorMsg("");
    };

    r.onresult = (e) => {
      // isFinal になったら確定テキストを返す
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          const text = e.results[i][0].transcript;
          isListening.current = false;
          setListening(false);
          onResult(text);
          return;
        }
      }
    };

    r.onend = () => {
      isListening.current = false;
      setListening(false);
    };

    r.onerror = (e) => {
      isListening.current = false;
      setListening(false);
      const msgs = {
        "not-allowed":  "🚫 マイクの使用が許可されていません。ブラウザのアドレスバー横のカメラ/マイクアイコンから許可してください。",
        "no-speech":    "🔇 音声が検出されませんでした。もう一度試してください。",
        "audio-capture":"🎤 マイクが見つかりません。接続を確認してください。",
        "network":      "🌐 ネットワークエラーが発生しました。",
      };
      setErrorMsg(msgs[e.error] || `エラー: ${e.error}`);
      onError?.(e.error);
    };

    try {
      r.start();
    } catch(e) {
      setErrorMsg("マイクを起動できませんでした。ページを再読み込みして試してください。");
    }
  }, [onResult, onError]);

  return { listening, supported, toggle, errorMsg };
}

// ─── UTILS ───────────────────────────────────────────────────────────────────
const btn = (color, extra={}) => ({
  display:"block", width:"100%", background:color, color:"#fff", border:"none",
  borderRadius:14, padding:"14px", fontSize:15, fontWeight:700,
  cursor:"pointer", fontFamily:"inherit", transition:"opacity .2s", ...extra
});

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function ProgressBar({ value, color="#f97316", height=8 }) {
  return (
    <div style={{ background:"#0f172a", borderRadius:99, height, overflow:"hidden" }}>
      <div style={{ width:`${value}%`, height:"100%", background:color, borderRadius:99, transition:"width .8s" }} />
    </div>
  );
}

function VocabCard({ item }) {
  const [f, setF] = useState(false);

  function handleTap() {
    setF(v => !v);
    // 裏面に返したとき、見出し語を全て読み上げる（カンマ・スラッシュ区切りにも対応）
    if (!f) speakVocab(item.kr);
  }

  return (
    <div onClick={handleTap} style={{
      background: f ? "#f97316" : "#1e293b", borderRadius:14, padding:"16px 18px",
      cursor:"pointer", transition:"all .25s", border:"1px solid rgba(249,115,22,.2)", marginBottom:8
    }}>
      {!f ? (
        /* 表面：日本語 → ハングル → カタカナ読み */
        <>
          <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9",marginBottom:8}}>{item.ja}</div>
          <div style={{fontSize:19,fontWeight:700,color:"#f97316",fontFamily:"'Noto Sans KR',sans-serif",marginBottom:4}}>{item.kr}</div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>{item.rom}</div>
          <div style={{fontSize:11,color:"#475569"}}>タップして音声を聞く 🔊</div>
        </>
      ) : (
        /* 裏面：ハングル大きく → 日本語 ※カタカナなし・音声自動再生済み */
        <>
          <div style={{fontSize:26,fontWeight:800,color:"#fff",fontFamily:"'Noto Sans KR',sans-serif",marginBottom:10,lineHeight:1.3}}>{item.kr}</div>
          <div style={{fontSize:15,color:"rgba(255,255,255,.85)",fontWeight:600,marginBottom:8}}>{item.ja}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>🔊 音声再生中 · もう一度タップ</div>
        </>
      )}
    </div>
  );
}


// ── 単語クイズ（フラッシュカードの後の定着チェック）────────────────────────
function makeQuestions(vocab) {
  return vocab.map((item, idx) => {
    const type = idx < 3 ? "ja-to-kr" : "audio-to-ja";
    const wrongs = shuffle(ALL_VOCAB.filter(v => v.kr !== item.kr)).slice(0, 3);
    const choices = shuffle([item, ...wrongs]);
    return { item, type, choices };
  });
}

function VocabQuiz({ vocab, onComplete }) {
  const [questions] = useState(() => makeQuestions(vocab));
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = questions[qIdx];

  useEffect(() => {
    if (q.type === "audio-to-ja") setTimeout(() => speakVocab(q.item.kr), 400);
  }, [qIdx]);

  function select(choice) {
    if (selected) return;
    setSelected(choice);
    const correct = choice.kr === q.item.kr;
    if (correct) { setScore(s => s + 1); setTimeout(() => speakVocab(q.item.kr), 200); }
  }

  function next() {
    if (qIdx < questions.length - 1) { setQIdx(i => i + 1); setSelected(null); }
    else setFinished(true);
  }

  if (finished) {
    const emoji = score >= 4 ? "🎉" : score >= 3 ? "👍" : "💪";
    const msg = score === 5 ? "完璧です！" : score >= 3 ? "よく覚えています！" : "復習を続けましょう！";
    return (
      <div style={{textAlign:"center",padding:"32px 0",animation:"fadeIn .4s ease"}}>
        <div style={{fontSize:52,marginBottom:12}}>{emoji}</div>
        <div style={{fontSize:22,fontWeight:800,color:"#f1f5f9",marginBottom:6}}>{score} / {questions.length} 正解</div>
        <div style={{fontSize:14,color:"#94a3b8",marginBottom:28}}>{msg}</div>
        <button onClick={onComplete} style={btn("#f97316")}>文法へ →</button>
      </div>
    );
  }

  const isCorrect = selected?.kr === q.item.kr;

  return (
    <div style={{animation:"fadeIn .4s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:12,color:"#64748b"}}>問題 {qIdx + 1} / {questions.length}</div>
        <div style={{fontSize:12,color:"#f97316",fontWeight:700}}>✓ {score}点</div>
      </div>
      <ProgressBar value={(qIdx / questions.length) * 100} color="#6366f1" />

      {/* 問題カード */}
      <div style={{background:"#1e293b",borderRadius:16,padding:22,marginTop:14,marginBottom:16,border:"1px solid rgba(99,102,241,.25)"}}>
        <div style={{fontSize:11,color:"#a5b4fc",fontWeight:700,letterSpacing:1,marginBottom:14}}>
          {q.type === "ja-to-kr" ? "🇯🇵 日本語 → 🇰🇷 韓国語" : "🔊 音声 → 🇯🇵 日本語"}
        </div>
        {q.type === "ja-to-kr"
          ? <div style={{fontSize:24,fontWeight:800,color:"#f1f5f9"}}>{q.item.ja}</div>
          : <div style={{textAlign:"center"}}>
              <button onClick={() => speakVocab(q.item.kr)}
                style={{background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.4)",borderRadius:"50%",width:72,height:72,cursor:"pointer",fontSize:32}}>
                🔊
              </button>
              <div style={{fontSize:12,color:"#64748b",marginTop:10}}>音声を聞いて日本語の意味を選んでください</div>
            </div>}
      </div>

      {/* 選択肢 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {q.choices.map((c, i) => {
          const isThisCorrect = c.kr === q.item.kr;
          const isThisSelected = selected?.kr === c.kr;
          let bg = "#1e293b", border = "1px solid rgba(255,255,255,.06)", color = "#f1f5f9";
          if (selected) {
            if (isThisCorrect) { bg = "rgba(22,163,74,.2)"; border = "1px solid #16a34a"; color = "#86efac"; }
            else if (isThisSelected) { bg = "rgba(239,68,68,.2)"; border = "1px solid #ef4444"; color = "#fca5a5"; }
            else { color = "#475569"; }
          }
          return (
            <button key={i} onClick={() => select(c)}
              style={{background:bg,border,borderRadius:12,padding:"14px 8px",
                cursor:selected?"default":"pointer",color,
                fontSize:q.type==="ja-to-kr"?14:13,fontWeight:600,
                fontFamily:q.type==="ja-to-kr"?"'Noto Sans KR',sans-serif":"inherit",
                textAlign:"center",lineHeight:1.4,transition:"all .2s"}}>
              {q.type === "ja-to-kr" ? c.kr : c.ja}
            </button>
          );
        })}
      </div>

      {/* 正誤フィードバック */}
      {selected && (
        <>
          <div style={{background:isCorrect?"rgba(22,163,74,.1)":"rgba(239,68,68,.1)",borderRadius:12,padding:"12px 14px",
            border:`1px solid ${isCorrect?"#16a34a":"#ef4444"}`,marginBottom:12}}>
            <div style={{fontSize:12,color:isCorrect?"#86efac":"#fca5a5",fontWeight:700,marginBottom:6}}>
              {isCorrect ? "✅ 正解！" : `❌ 正しくは → ${q.item.ja}`}
            </div>
            <div style={{fontSize:16,color:"#f1f5f9",fontFamily:"'Noto Sans KR',sans-serif",marginBottom:3}}>{q.item.kr}</div>
            <div style={{fontSize:12,color:"#94a3b8"}}>{q.item.rom}</div>
          </div>
          <button onClick={next} style={btn("#6366f1")}>
            {qIdx < questions.length - 1 ? "次の問題 →" : "結果を見る →"}
          </button>
        </>
      )}
    </div>
  );
}

function MorningLesson({ lesson, onComplete }) {
  const [step, setStep] = useState(0);
  const { morning } = lesson;
  return (
    <div style={{animation:"fadeIn .4s ease"}}>
      {step===0 && <>
        <div style={{fontSize:11,color:"#f97316",fontWeight:700,letterSpacing:2,marginBottom:16}}>☀️ 今日のフレーズ</div>
        <div style={{background:"linear-gradient(135deg,#f97316,#dc2626)",borderRadius:20,padding:24,marginBottom:18}}>
          {/* 日本語を先に → ハングル → カタカナ → 音声 */}
          <div style={{fontSize:14,color:"rgba(255,255,255,.7)",fontWeight:600,marginBottom:6,letterSpacing:0.5}}>日本語</div>
          <div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:14,lineHeight:1.4}}>{morning.phrase.ja}</div>
          <div style={{height:"1px",background:"rgba(255,255,255,.2)",marginBottom:14}}/>
          <div style={{fontSize:14,color:"rgba(255,255,255,.7)",fontWeight:600,marginBottom:6,letterSpacing:0.5}}>韓国語</div>
          <div style={{fontSize:22,fontWeight:800,color:"#fff",fontFamily:"'Noto Sans KR',sans-serif",lineHeight:1.4,marginBottom:4}}>{morning.phrase.kr}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.75)",marginBottom:14}}>{morning.phrase.rom}</div>
          <button onClick={()=>speakKorean(morning.phrase.kr)}
            style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:10,color:"#fff",padding:"8px 18px",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
            🔊 発音を聞く
          </button>
        </div>
        <button onClick={()=>setStep(1)} style={btn("#f97316")}>単語を学ぶ →</button>
      </>}
      {step===1 && <>
        <div style={{fontSize:11,color:"#f97316",fontWeight:700,letterSpacing:2,marginBottom:6}}>📚 今日の単語（5個）</div>
        <div style={{color:"#64748b",fontSize:13,marginBottom:14}}>タップして意味を確認</div>
        {morning.vocab.map((v,i)=><VocabCard key={i} item={v}/>)}
        <button onClick={()=>setStep(2)} style={{...btn("#6366f1"),marginTop:12}}>クイズで定着確認 →</button>
      </>}
      {step===2 &&
        <VocabQuiz vocab={morning.vocab} onComplete={()=>setStep(3)} />}
      {step===3 &&
        <GrammarExplain grammar={morning.grammar} onComplete={()=>{setStep(4);onComplete("morning");}} />}
      {step===4 && <div style={{textAlign:"center",padding:"36px 0"}}>
        <div style={{fontSize:52,marginBottom:10}}>🌟</div>
        <div style={{fontSize:20,fontWeight:800,color:"#f1f5f9"}}>朝のレッスン完了！</div>
        <div style={{fontSize:14,color:"#94a3b8",marginTop:8}}>夜はAIと声で練習しましょう 🎙️</div>
      </div>}
    </div>
  );
}


// ── 文法詳細解説（Claude API で動的生成）──────────────────────────────────
function GrammarExplain({ grammar, onComplete }) {
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({
            system: "あなたは韓国語教師です。日本人初級〜初中級学習者向けに文法を解説します。JSONのみを返してください。余分なテキストやマークダウンコードブロックは一切不要です。",
            messages: [{role:"user", content:
              `文法「${grammar.point}」（${grammar.ja}）を解説してください。
以下のJSON形式のみで返答してください：
{"rule":"この文法の仕組みを2〜3文で（なぜそうなるか・どう使うか）","jpTip":"日本語話者へのヒントや注意点を1文で","examples":[{"kr":"韓国語例文","rom":"カタカナ読み","ja":"日本語訳"},{"kr":"韓国語例文2","rom":"カタカナ読み","ja":"日本語訳"},{"kr":"韓国語例文3","rom":"カタカナ読み","ja":"日本語訳"}]}`
            }]
          })
        });
        const d = await res.json();
        const text = (d.content?.[0]?.text || "").replace(/\`\`\`json|\`\`\`/g,"").trim();
        setExp(JSON.parse(text));
      } catch(e) {
        setExp(null);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div style={{textAlign:"center",padding:"40px 0"}}>
      <div style={{fontSize:36,marginBottom:12,animation:"pulse 1.5s infinite"}}>⚡</div>
      <div style={{fontSize:14,color:"#94a3b8"}}>文法を解説中…</div>
    </div>
  );

  // APIエラー時は元のシンプル表示にフォールバック
  const examples = exp?.examples || [{kr:grammar.example, rom:"", ja:""}];

  return (
    <div style={{animation:"fadeIn .4s ease"}}>
      <div style={{fontSize:12,color:"#f97316",fontWeight:700,letterSpacing:2,marginBottom:16}}>⚡ 文法ポイント</div>

      {/* タイトル */}
      <div style={{background:"linear-gradient(135deg,rgba(249,115,22,.15),rgba(220,38,38,.08))",borderRadius:16,padding:"16px 18px",border:"1px solid rgba(249,115,22,.3)",marginBottom:14}}>
        <div style={{fontSize:22,fontWeight:800,color:"#f97316",marginBottom:4}}>{grammar.point}</div>
        <div style={{fontSize:15,color:"#f1f5f9",fontWeight:600}}>{grammar.ja}</div>
      </div>

      {/* 仕組み */}
      {exp?.rule && (
        <div style={{background:"#1e293b",borderRadius:14,padding:"14px 16px",marginBottom:10,border:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{fontSize:11,color:"#94a3b8",letterSpacing:1,marginBottom:8}}>📖 仕組み</div>
          <div style={{fontSize:14,color:"#f1f5f9",lineHeight:1.8}}>{exp.rule}</div>
        </div>
      )}

      {/* 日本語話者ヒント */}
      {exp?.jpTip && (
        <div style={{background:"rgba(99,102,241,.08)",borderRadius:14,padding:"12px 16px",marginBottom:14,border:"1px solid rgba(99,102,241,.2)"}}>
          <div style={{fontSize:11,color:"#a5b4fc",letterSpacing:1,marginBottom:6}}>💡 日本語話者へのヒント</div>
          <div style={{fontSize:14,color:"#e0e7ff",lineHeight:1.8}}>{exp.jpTip}</div>
        </div>
      )}

      {/* 例文 */}
      <div style={{fontSize:11,color:"#64748b",letterSpacing:1,marginBottom:10}}>例文</div>
      {examples.map((ex, i) => (
        <div key={i} style={{background:"#0f172a",borderRadius:12,padding:"12px 14px",marginBottom:8,border:"1px solid rgba(255,255,255,.05)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
            <div style={{flex:1}}>
              <div style={{fontSize:15,color:"#f1f5f9",fontFamily:"'Noto Sans KR',sans-serif",marginBottom:4}}>{ex.kr}</div>
              {ex.rom && <div style={{fontSize:12,color:"#94a3b8",marginBottom:3}}>{ex.rom}</div>}
              <div style={{fontSize:13,color:"#64748b"}}>{ex.ja}</div>
            </div>
            <button onClick={() => speakKorean(ex.kr)}
              style={{background:"rgba(249,115,22,.15)",border:"1px solid rgba(249,115,22,.25)",borderRadius:8,
                color:"#f97316",padding:"6px 10px",cursor:"pointer",fontSize:12,flexShrink:0,fontFamily:"inherit"}}>
              🔊
            </button>
          </div>
        </div>
      ))}

      <button onClick={onComplete} style={{...btn("#16a34a"),marginTop:8}}>✅ 朝のレッスン完了！</button>
    </div>
  );
}

function EveningPractice({ lesson, onComplete }) {
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [inputText, setInputText] = useState("");
  const [voiceMode, setVoiceMode] = useState(true);
  const [liveT] = useState("");  // unused, kept for compat
  const exchanges = useRef(0);

  const chatRef = useRef(null);
  const hasKoreanVoice = useKoreanVoiceCheck();

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[chat]);

  const {listening, supported, toggle, errorMsg} = useVoice({
    onResult: text => { handleSend(text); },
    onError: () => {}
  });

  async function startChat() {
    setStarted(true);
    setLoading(true);
    // 先にローディングメッセージをチャットに表示してiOSでも状態が見えるようにする
    setChat([{role:"system",content:"AIチューターに接続中…"}]);
    const reply = await askTutor(
      [{role:"user", content:`テーマ「${lesson.theme}」で会話練習。今週学んだ語彙を使って韓国語で挨拶してください。`}],
      lesson
    );
    setChat([{role:"assistant", content:reply}]);
    setLoading(false);
    setTimeout(() => speakKorean(reply), 300);
  }

  async function handleSend(text) {
    if(!text?.trim()||loading) return;
    exchanges.current++;
    const newChat = [...chat,{role:"user",content:text.trim()}];
    setChat(newChat); setInputText(""); setLoading(true);
    const reply = await askTutor(newChat, lesson);
    setChat([...newChat,{role:"assistant",content:reply}]); setLoading(false);
    setTimeout(()=>speakKorean(reply),200);
    if(exchanges.current>=4) setTimeout(()=>setDone(true),1200);
  }

  if(!started) return (
    <div style={{animation:"fadeIn .4s ease"}}>
      <div style={{background:"#1e293b",borderRadius:20,padding:24,marginBottom:18,border:"1px solid rgba(99,102,241,.2)"}}>
        <div style={{fontSize:32,marginBottom:10}}>🎙️</div>
        <div style={{fontSize:17,fontWeight:800,color:"#f1f5f9",marginBottom:8}}>声で話す会話練習</div>
        <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.9}}>
          今週のテーマ<span style={{color:"#f97316",fontWeight:600}}>「{lesson.theme}」</span>で練習します。<br/><br/>
          <span style={{color:"#fed7aa",fontWeight:700}}>🗣 リピート</span>：AIの韓国語をそのまま声に出す<br/>
          <span style={{color:"#c7d2fe",fontWeight:700}}>💭 応答</span>：質問にヒントを見て韓国語で答える<br/><br/>
          AI発言は🔊 自動読み上げ。マイクで話してください。
        </div>
        {!supported && <div style={{marginTop:12,background:"rgba(251,191,36,.08)",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#fbbf24"}}>⚠️ 音声認識非対応。テキストで入力してください。</div>}
        {hasKoreanVoice === false && (
          <div style={{marginTop:12,background:"rgba(239,68,68,.08)",borderRadius:10,padding:"12px 14px",fontSize:12,color:"#fca5a5",border:"1px solid rgba(239,68,68,.2)",lineHeight:1.7}}>
            ⚠️ <strong>韓国語の読み上げ音声が見つかりません。</strong><br/>
            「ピリオド」と読まれる場合の解決方法：<br/>
            <span style={{color:"#fef3c7"}}>設定 → アクセシビリティ → 読み上げコンテンツ → 声 → 韓国語 → ダウンロード</span><br/>
            ダウンロード後にブラウザを再読み込みしてください。<br/>
            テキスト入力モードで会話練習は今すぐできます。
          </div>
        )}
      </div>
      <button onClick={startChat} style={btn("#6366f1")}>🎙️ 会話練習を始める</button>
    </div>
  );

  if(done) return (
    <div style={{textAlign:"center",padding:"36px 0",animation:"fadeIn .4s ease"}}>
      <div style={{fontSize:52,marginBottom:10}}>🌙</div>
      <div style={{fontSize:20,fontWeight:800,color:"#f1f5f9",marginBottom:6}}>会話練習完了！</div>
      <div style={{fontSize:14,color:"#94a3b8",marginBottom:22}}>声に出して練習できました。お疲れさまです！</div>
      <button onClick={()=>onComplete("evening")} style={btn("#16a34a")}>✅ 完了して記録する</button>
    </div>
  );

  return (
    <div style={{animation:"fadeIn .4s ease"}}>
      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["🎙️ 音声",true],["⌨️ テキスト",false]].map(([l,v])=>(
          <button key={String(v)} onClick={()=>setVoiceMode(v)}
            style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,background:voiceMode===v?"#6366f1":"#1e293b",color:voiceMode===v?"#fff":"#64748b"}}>
            {l}
          </button>
        ))}
      </div>
      <div ref={chatRef} style={{height:260,overflowY:"auto",background:"#0f172a",borderRadius:16,padding:"12px 10px",marginBottom:12,border:"1px solid #1e293b"}}>
        {chat.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10,gap:6,alignItems:"flex-end"}}>
            {m.role==="system" && (
              <div style={{width:"100%",textAlign:"center",color:"#475569",fontSize:12,padding:"4px 0"}}>
                ⏳ {m.content}
              </div>
            )}
            {m.role==="assistant" && (
              <button onClick={()=>speakKorean(m.content)}
                style={{background:"rgba(99,102,241,.15)",border:"1px solid rgba(99,102,241,.3)",borderRadius:8,width:26,height:26,cursor:"pointer",fontSize:12,flexShrink:0,color:"#fff"}}>🔊</button>
            )}
            <div style={{maxWidth:"82%",padding:"10px 12px",fontSize:13,lineHeight:1.65,color:"#f1f5f9",
              borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              background:m.role==="user"?"#f97316":"#1e293b",
              border:m.role==="assistant"?"1px solid rgba(99,102,241,.2)":"none"}}>
              {m.content.split("\n").map((line, li) => {
                const isPhrase  = line.startsWith("🔊:");
                const isRepeat  = line.startsWith("🗣");
                const isHint    = line.startsWith("💭");
                const isEmpty   = line.trim() === "";
                if (isEmpty) return <div key={li} style={{height:6}}/>;
                return (
                  <div key={li} style={{
                    whiteSpace:"pre-wrap",
                    marginTop: (isRepeat||isHint) ? 10 : isPhrase ? 6 : 2,
                    background: isRepeat ? "rgba(249,115,22,.18)"
                              : isHint   ? "rgba(99,102,241,.15)"
                              : isPhrase ? "rgba(99,102,241,.2)"
                              : "transparent",
                    borderRadius: (isRepeat||isHint||isPhrase) ? 10 : 0,
                    padding: (isRepeat||isHint) ? "8px 12px"
                           : isPhrase           ? "6px 10px"
                           : "0",
                    borderLeft: isRepeat ? "3px solid #f97316"
                              : isHint   ? "3px solid #6366f1"
                              : "none",
                    color: isRepeat ? "#fed7aa"
                         : isHint   ? "#c7d2fe"
                         : isPhrase ? "#a5b4fc"
                         : "#f1f5f9",
                    fontWeight: (isRepeat||isHint||isPhrase) ? 700 : 400,
                    fontFamily: (isRepeat||isPhrase) ? "'Noto Sans KR',sans-serif" : "inherit",
                    fontSize: isRepeat ? 16 : isHint ? 13 : isPhrase ? 14 : 13,
                  }}>{line}</div>
                );
              })}
            </div>
          </div>
        ))}
        {loading && <div style={{display:"flex",gap:4,padding:"6px 10px"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#6366f1",animation:`bounce 1.2s ${i*.2}s infinite`}}/>)}</div>}
      </div>
      {voiceMode && supported
        ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
            {errorMsg && (
              <div style={{background:"rgba(239,68,68,.1)",borderRadius:12,padding:"10px 14px",fontSize:12,color:"#fca5a5",width:"100%",border:"1px solid rgba(239,68,68,.25)",lineHeight:1.6}}>
                {errorMsg}
              </div>
            )}
            <div style={{background:"#0f172a",borderRadius:12,padding:"10px 14px",fontSize:13,
              color:listening?"#a5b4fc":"#475569",width:"100%",
              border:`1px solid ${listening?"rgba(99,102,241,.4)":"rgba(255,255,255,.05)"}`,
              textAlign:"center",minHeight:38,transition:"all .3s"}}>
              {listening ? "🎙️ 聞いています… 話し終わったらもう一度押す" : "ボタンを押して韓国語を話す"}
            </div>
            <button onClick={toggle} disabled={loading}
              style={{width:84,height:84,borderRadius:"50%",border:"none",
                cursor:loading?"not-allowed":"pointer",
                background:listening
                  ?"radial-gradient(circle,#ef4444,#dc2626)"
                  :"radial-gradient(circle,#6366f1,#4338ca)",
                boxShadow:listening
                  ?"0 0 0 10px rgba(239,68,68,.2),0 0 0 20px rgba(239,68,68,.08)"
                  :"0 0 0 6px rgba(99,102,241,.2)",
                fontSize:30,transition:"all .3s",
                animation:listening?"voicePulse 1s infinite":"none"}}>
              {listening ? "⏹" : "🎙️"}
            </button>
            <div style={{fontSize:12,color:listening?"#ef4444":"#64748b",fontWeight:listening?700:400}}>
              {listening ? "録音中… もう一度押すと送信" : "1回押して開始 → もう1回押して送信"}
            </div>
          </div>
        : <div style={{display:"flex",gap:8}}>
            <input value={inputText} onChange={e=>setInputText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend(inputText)}
              placeholder="日本語でも韓国語でもOK..."
              style={{flex:1,background:"#1e293b",border:"1px solid rgba(99,102,241,.3)",borderRadius:12,padding:"11px 14px",color:"#f1f5f9",fontSize:13,fontFamily:"inherit"}}/>
            <button onClick={()=>handleSend(inputText)} disabled={loading}
              style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:12,padding:"11px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:700}}>送信</button>
          </div>}
      {/* 操作ガイド */}
      <div style={{background:"#1e293b",borderRadius:10,padding:"8px 12px",marginTop:10,border:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{fontSize:11,color:"#64748b",lineHeight:1.7}}>
          <span style={{color:"#fed7aa",fontWeight:700}}>🗣 リピート</span>：表示された韓国語をそのまま声に出す
          {"　"}
          <span style={{color:"#c7d2fe",fontWeight:700}}>💭 応答</span>：質問にヒントを参考に韓国語で答える
        </div>
      </div>
      <div style={{textAlign:"center",marginTop:8,fontSize:11,color:"#475569"}}>あと {Math.max(0,4-exchanges.current)} 回やり取りで完了</div>
    </div>
  );
}

// 週の詳細・復習画面
function WeekDetail({ lesson, weekIndex, onBack, onStartEvening }) {
  const isLocked = lesson.week - 1 > weekIndex + 1;  // 次の課まで閲覧可
  const isCurrent = lesson.week - 1 === weekIndex;
  const [step, setStep] = useState(0);

  if (isLocked) return (
    <div style={{animation:"fadeIn .4s ease"}}>
      <div style={{padding:"22px 22px 0"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:10,padding:0,fontFamily:"inherit"}}>← カリキュラムへ</button>
      </div>
      <div style={{padding:"40px 22px",textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:16}}>🔒</div>
        <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9",marginBottom:8}}>Week {lesson.week}：{lesson.theme}</div>
        <div style={{fontSize:14,color:"#64748b",marginBottom:24,lineHeight:1.7}}>
          この課はまだ学習できません。<br/>
          現在の課（Week {weekIndex + 1}）の<br/>
          朝・夜レッスンを完了すると解放されます。
        </div>
        <div style={{background:"#1e293b",borderRadius:14,padding:"14px 18px",border:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{fontSize:11,color:"#64748b",marginBottom:4}}>学習予定のフレーズ</div>
          <div style={{fontSize:18,fontWeight:700,color:"#475569",fontFamily:"'Noto Sans KR',sans-serif"}}>
            {lesson.morning.phrase.kr}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{animation:"fadeIn .4s ease"}}>
      <div style={{padding:"22px 22px 0",background:"linear-gradient(180deg,#1e293b 0%,transparent 100%)"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:10,padding:0,fontFamily:"inherit"}}>← カリキュラムへ</button>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <div style={{background:PHASE_COLORS[lesson.phase],borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>Phase {lesson.phase}</div>
          {isCurrent && <div style={{background:"#f97316",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>今ここ</div>}
          {!isCurrent && lesson.week - 1 < weekIndex && <div style={{background:"#16a34a",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>復習モード</div>}
          {!isCurrent && lesson.week - 1 === weekIndex + 1 && <div style={{background:"#6366f1",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>次の課（プレビュー）</div>}
        </div>
        <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9",marginBottom:4}}>Week {lesson.week}：{lesson.theme}</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:18}}>{lesson.topik}</div>
      </div>
      <div style={{padding:"8px 22px 100px"}}>
        {/* フレーズ */}
        <div style={{background:"linear-gradient(135deg,#f97316,#dc2626)",borderRadius:18,padding:22,marginBottom:14}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,.7)",marginBottom:4,letterSpacing:1}}>キーフレーズ</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.7)",fontWeight:600,marginBottom:4}}>日本語</div>
          <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:10,lineHeight:1.4}}>{lesson.morning.phrase.ja}</div>
          <div style={{height:"1px",background:"rgba(255,255,255,.2)",marginBottom:10}}/>
          <div style={{fontSize:13,color:"rgba(255,255,255,.7)",fontWeight:600,marginBottom:4}}>韓国語</div>
          <div style={{fontSize:19,fontWeight:800,color:"#fff",fontFamily:"'Noto Sans KR',sans-serif",lineHeight:1.4,marginBottom:4}}>{lesson.morning.phrase.kr}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.75)",marginBottom:10}}>{lesson.morning.phrase.rom}</div>
          <button onClick={()=>speakKorean(lesson.morning.phrase.kr)}
            style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:10,color:"#fff",padding:"7px 14px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
            🔊 発音を聞く
          </button>
        </div>
        {/* 単語 */}
        <div style={{fontSize:11,color:"#64748b",letterSpacing:1,marginBottom:10}}>📚 今週の単語</div>
        {lesson.morning.vocab.map((v,i)=><VocabCard key={i} item={v}/>)}
        {/* 文法 */}
        <div style={{background:"#1e293b",borderRadius:18,padding:20,border:"1px solid rgba(249,115,22,.2)",marginTop:14}}>
          <div style={{fontSize:11,color:"#64748b",letterSpacing:1,marginBottom:8}}>⚡ 文法ポイント</div>
          <div style={{fontSize:18,fontWeight:800,color:"#f97316",marginBottom:6}}>{lesson.morning.grammar.point}</div>
          <div style={{fontSize:14,color:"#f1f5f9",marginBottom:12}}>{lesson.morning.grammar.ja}</div>
          <div style={{background:"#0f172a",borderRadius:12,padding:"12px 14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:11,color:"#64748b"}}>例文</div>
              <button onClick={()=>speakKoreanAll(lesson.morning.grammar.example)}
                style={{background:"rgba(249,115,22,.15)",border:"1px solid rgba(249,115,22,.3)",borderRadius:8,color:"#f97316",padding:"4px 10px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>
                🔊 聞く
              </button>
            </div>
            <div style={{fontSize:14,color:"#f1f5f9",fontFamily:"'Noto Sans KR',sans-serif",lineHeight:1.6}}>{lesson.morning.grammar.example}</div>
          </div>
        </div>

        {/* 夜の会話練習ボタン */}
        <div style={{marginTop:20,borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:18}}>
          <div style={{fontSize:11,color:"#64748b",marginBottom:10}}>この課で会話練習する</div>
          <button onClick={()=>onStartEvening(lesson)}
            style={{...btn("#6366f1"),display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            🎙️ 夜の音声会話練習
          </button>
        </div>
      </div>
    </div>
  );
}

// カリキュラム表示画面
function CurriculumView({ weekIndex, onClose, onSelectWeek }) {
  const phases = [1,2,3,4];
  return (
    <div style={{animation:"fadeIn .4s ease"}}>
      <div style={{padding:"22px 22px 0",background:"linear-gradient(180deg,#1e293b 0%,transparent 100%)"}}>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:10,padding:0,fontFamily:"inherit"}}>← ホームへ</button>
        <div style={{fontSize:19,fontWeight:800,marginBottom:4}}>📅 52週カリキュラム</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:4}}>TOPIK 4級 1年ロードマップ</div>
        <div style={{fontSize:11,color:"#475569",marginBottom:18}}>✅ 復習可　🔒 学習済みの次の課まで解放</div>
      </div>
      <div style={{padding:"0 22px 100px",overflowY:"auto"}}>
        {phases.map(phase=>(
          <div key={phase} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{background:PHASE_COLORS[phase],borderRadius:8,padding:"4px 12px",fontSize:11,fontWeight:700,color:"#fff"}}>PHASE {phase}</div>
              <div style={{fontSize:13,color:"#94a3b8"}}>{PHASE_LABELS[phase].replace("\n","　")}</div>
            </div>
            {CURRICULUM.filter(w=>w.phase===phase).map(w=>{
              const wIdx = w.week - 1;
              const isDone = wIdx < weekIndex;
              const isCurrent = wIdx === weekIndex;
              const isNextUnlocked = wIdx === weekIndex + 1;
              const isLocked = wIdx > weekIndex + 1;
              return (
                <div key={w.week}
                  onClick={()=>onSelectWeek(w)}
                  style={{
                    display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:12,marginBottom:6,
                    cursor: isLocked ? "default" : "pointer",
                    opacity: isLocked ? 0.45 : 1,
                    background: isCurrent?"rgba(249,115,22,.1)":isDone?"rgba(22,163,74,.06)":isNextUnlocked?"rgba(99,102,241,.06)":"#1e293b",
                    border: isCurrent?"1px solid rgba(249,115,22,.4)":isDone?"1px solid rgba(22,163,74,.2)":isNextUnlocked?"1px solid rgba(99,102,241,.25)":"1px solid rgba(255,255,255,.05)"
                  }}>
                  <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,flexShrink:0,
                    background:isCurrent?"#f97316":isDone?"#16a34a":isNextUnlocked?"#6366f1":isLocked?"#1e293b":"#334155",
                    color: isLocked?"#475569":"#fff",
                    border: isLocked?"1px solid #334155":"none"}}>
                    {isLocked?"🔒":isDone?"✓":w.week}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:isCurrent?"#f97316":isDone?"#86efac":isNextUnlocked?"#a5b4fc":"#94a3b8"}}>{w.theme}</div>
                    <div style={{fontSize:10,color:"#64748b",marginTop:1}}>{w.topik}</div>
                  </div>
                  <div style={{fontSize:11,fontWeight:700,color:isCurrent?"#f97316":isDone?"#16a34a":isNextUnlocked?"#6366f1":"#334155"}}>
                    {isCurrent?"今ここ ›":isDone?"復習 ›":isNextUnlocked?"次の課 ›":""}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [reviewLesson, setReviewLesson] = useState(null); // 復習用の課
  const [st, setSt] = useState({
    streak:0, totalDays:0, lastDate:null,
    weekIndex:0, completedToday:{morning:false,evening:false}, progressPct:0
  });

  useEffect(()=>{
    {
      const saved = loadState();
      if(saved){
        const today = new Date().toDateString();
        if(saved.lastDate!==today){
          saved.completedToday={morning:false,evening:false};
          const yest=new Date(); yest.setDate(yest.getDate()-1);
          if(saved.lastDate!==yest.toDateString()) saved.streak=0;
        }
        setSt(saved);
      }
      setScreen("home");
    }
  },[]);

  function complete(session) {
    const today = new Date().toDateString();
    const u = {...st, completedToday:{...st.completedToday,[session]:true}, lastDate:today};
    const both = u.completedToday.morning && u.completedToday.evening;

    // 学習日数・ストリーク：1日1回カウント
    if(both && st.bothCompletedDate !== today){
      u.bothCompletedDate = today;
      u.streak = st.streak + 1;
      u.totalDays = st.totalDays + 1;
      u.progressPct = Math.min(100, st.progressPct + 100/52);
    } else if(!st.completedToday[session] && !both){
      u.progressPct = Math.min(100, st.progressPct + 50/52);
    }

    // 週進行：朝夜完了したら即座に次の課へ＆completedTodayをリセット
    // → そのまま次の課をスタートできる（完全自由ペース）
    if(both && u.weekIndex < 51){
      u.weekIndex = Math.min(51, st.weekIndex + 1);
      u.completedToday = {morning: false, evening: false};
    }

    setSt(u); saveState(u); setScreen("home");
  }

  const lesson = CURRICULUM[Math.min(st.weekIndex, 51)];
  const topik = TOPIK_LEVELS.find(l=>st.progressPct>=l.range[0]&&st.progressPct<l.range[1])||TOPIK_LEVELS[4];
  const todayStr = new Date().toLocaleDateString("ja-JP",{month:"long",day:"numeric",weekday:"short"});
  const weekProgress = Math.round((st.weekIndex/52)*100);
  const C = {background:"#1e293b",borderRadius:18,padding:16,border:"1px solid rgba(255,255,255,.06)",marginBottom:12};

  return (
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:"#0f172a",fontFamily:"'Noto Sans JP','Noto Sans KR',sans-serif",color:"#f1f5f9",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800&family=Noto+Sans+KR:wght@400;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
        @keyframes voicePulse{0%,100%{box-shadow:0 0 0 10px rgba(239,68,68,.2),0 0 0 20px rgba(239,68,68,.08)}50%{box-shadow:0 0 0 14px rgba(239,68,68,.3),0 0 0 26px rgba(239,68,68,.12)}}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#334155;border-radius:4px}
        input{outline:none}input::placeholder{color:#475569}button:active{opacity:.82}
      `}</style>

      {screen==="loading" && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>🇰🇷</div><div style={{fontSize:17,fontWeight:700,color:"#f97316"}}>読み込み中...</div></div>
        </div>
      )}

      {screen==="home" && (
        <div style={{animation:"fadeIn .4s ease"}}>
          <div style={{padding:"24px 20px 0",background:"linear-gradient(180deg,#1e293b 0%,transparent 100%)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontSize:11,color:"#64748b"}}>{todayStr}</div>
                <div style={{fontSize:18,fontWeight:800}}>ひろしさん、<span style={{color:"#f97316"}}>안녕!</span></div>
              </div>
              <div style={{textAlign:"center",background:"#1e293b",borderRadius:14,padding:"8px 14px",border:"1px solid rgba(249,115,22,.2)"}}>
                <div style={{fontSize:20,fontWeight:800,color:"#f97316"}}>🔥 {st.streak}</div>
                <div style={{fontSize:10,color:"#64748b"}}>連続学習日</div>
              </div>
            </div>
          </div>

          <div style={{padding:"8px 20px 120px"}}>
            {/* Week + TOPIK progress */}
            <div style={{...C,background:"linear-gradient(135deg,#1e293b,#0f172a)",border:`1px solid ${PHASE_COLORS[lesson.phase]}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <div style={{background:PHASE_COLORS[lesson.phase],borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>
                      Phase {lesson.phase}
                    </div>
                    <div style={{fontSize:11,color:"#64748b"}}>Week {lesson.week}/52</div>
                  </div>
                  <div style={{fontSize:15,fontWeight:800,color:"#f1f5f9"}}>{lesson.theme}</div>
                  <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{lesson.topik}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:"#64748b"}}>TOPIK目標</div>
                  <div style={{fontSize:14,fontWeight:700,color:topik.color}}>{topik.level}</div>
                </div>
              </div>
              <div style={{marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#64748b",marginBottom:4}}>
                  <span>学習進捗</span><span style={{color:PHASE_COLORS[lesson.phase]}}>{weekProgress}%（{lesson.week}週目）</span>
                </div>
                <ProgressBar value={weekProgress} color={PHASE_COLORS[lesson.phase]} height={6}/>
              </div>
              <button onClick={()=>setScreen("curriculum")}
                style={{width:"100%",background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,padding:"8px",color:"#94a3b8",cursor:"pointer",fontSize:12,fontFamily:"inherit",marginTop:4}}>
                📅 全52週カリキュラムを見る
              </button>
            </div>

            {/* Sessions */}
            <div style={{fontSize:11,color:"#64748b",letterSpacing:1,marginBottom:8}}>TODAY</div>
            {[
              {id:"morning",icon:st.completedToday.morning?"✅":"☀️",label:st.completedToday.morning?"朝のレッスン（復習）":"朝のレッスン",sub:st.completedToday.morning?"タップして復習できます • 約10分":"フレーズ・単語・文法 • 約10分",color:"#f97316",done:false,locked:false},
              {id:"evening",icon:st.completedToday.evening?"✅":"🎙️",label:st.completedToday.evening?"夜の練習完了！":"夜の音声会話練習",sub:`「${lesson.theme}」でAIと会話 • 約10分`,color:"#6366f1",done:st.completedToday.evening,locked:false},
            ].map(s=>(
              <div key={s.id} style={{...C,cursor:(!s.done&&!s.locked)?"pointer":"default",opacity:s.locked?.4:1,
                border:s.done?"1px solid #16a34a":`1px solid rgba(${s.color==="#f97316"?"249,115,22":"99,102,241"},.2)`}}
                onClick={()=>!s.done&&!s.locked&&setScreen(s.id)}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,
                    background:s.done?"rgba(22,163,74,.15)":`rgba(${s.color==="#f97316"?"249,115,22":"99,102,241"},.12)`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{s.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,color:s.done?"#16a34a":"#f1f5f9"}}>{s.label}</div>
                    <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{s.sub}</div>
                  </div>
                  {!s.done&&!s.locked&&<div style={{color:s.color,fontSize:20}}>›</div>}
                </div>
              </div>
            ))}

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{...C,textAlign:"center"}}><div style={{fontSize:24,fontWeight:800,color:"#f97316"}}>{st.totalDays}</div><div style={{fontSize:11,color:"#64748b"}}>学習日数</div></div>
              <div style={{...C,textAlign:"center"}}><div style={{fontSize:24,fontWeight:800,color:"#6366f1"}}>{Math.round(st.totalDays*10)}</div><div style={{fontSize:11,color:"#64748b"}}>習得フレーズ（推定）</div></div>
            </div>
          </div>
        </div>
      )}

      {screen==="curriculum" && !selectedWeek &&
        <CurriculumView
          weekIndex={st.weekIndex}
          onClose={()=>setScreen("home")}
          onSelectWeek={w=>setSelectedWeek(w)}
        />}
      {screen==="curriculum" && selectedWeek &&
        <WeekDetail
          lesson={selectedWeek}
          weekIndex={st.weekIndex}
          onBack={()=>setSelectedWeek(null)}
          onStartEvening={w=>{setReviewLesson(w);setSelectedWeek(null);setScreen("review-evening");}}
        />}

      {screen==="review-evening" && reviewLesson && (
        <div style={{animation:"fadeIn .4s ease"}}>
          <div style={{padding:"22px 20px 0",background:"linear-gradient(180deg,#1e293b 0%,transparent 100%)"}}>
            <button onClick={()=>{setScreen("curriculum");setReviewLesson(null);}}
              style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:10,padding:0,fontFamily:"inherit"}}>
              ← カリキュラムへ
            </button>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{background:PHASE_COLORS[reviewLesson.phase],borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>Phase {reviewLesson.phase}</div>
              <div style={{background:"#16a34a",borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>復習</div>
            </div>
            <div style={{fontSize:18,fontWeight:800,marginBottom:3}}>🎙️ 夜の音声会話練習</div>
            <div style={{fontSize:12,color:"#64748b",marginBottom:18}}>Week {reviewLesson.week}：{reviewLesson.theme}</div>
          </div>
          <div style={{padding:"8px 20px 80px"}}>
            {/* 復習セッションは進捗に影響しない */}
            <EveningPractice lesson={reviewLesson} onComplete={()=>{setScreen("curriculum");setReviewLesson(null);}} />
          </div>
        </div>
      )}

      {(screen==="morning"||screen==="evening") && (
        <div style={{animation:"fadeIn .4s ease"}}>
          <div style={{padding:"22px 20px 0",background:"linear-gradient(180deg,#1e293b 0%,transparent 100%)"}}>
            <button onClick={()=>setScreen("home")} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:10,padding:0,fontFamily:"inherit"}}>← ホームへ</button>
            <div style={{fontSize:18,fontWeight:800,marginBottom:3}}>{screen==="morning"?"☀️ 朝のレッスン":"🎙️ 夜の音声会話練習"}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:18}}>
              <div style={{background:PHASE_COLORS[lesson.phase],borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>Phase {lesson.phase}</div>
              <div style={{fontSize:12,color:"#64748b"}}>Week {lesson.week}：{lesson.theme}</div>
            </div>
          </div>
          <div style={{padding:"8px 20px 80px"}}>
            {screen==="morning"
              ? <MorningLesson lesson={lesson} onComplete={complete}/>
              : <EveningPractice lesson={lesson} onComplete={complete}/>}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(15,23,42,.96)",backdropFilter:"blur(16px)",padding:"10px 20px 18px",borderTop:"1px solid rgba(255,255,255,.07)"}}>
        <div style={{display:"flex"}}>
          {[["home","🏠","ホーム"],["morning","☀️","朝"],["evening","🎙️","夜"],["curriculum","📅","週次"]].map(([id,icon,label])=>(
            <div key={id} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"7px 0",
              color:screen===id?"#f97316":"#475569",fontSize:10,fontWeight:screen===id?700:500,transition:"color .2s"}}
              onClick={()=>{
                // 夜の練習はいつでもアクセス可
                setScreen(id);
              }}>
              <span style={{fontSize:18}}>{icon}</span>{label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
