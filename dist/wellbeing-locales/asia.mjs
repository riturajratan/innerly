// Editorial translations, not independently validated clinical versions.
const pack=(questions,frequency,options,timeframe,context,note,coverage,privacy,ui)=>({questions:questions.split('\n'),frequency:frequency.split('|'),options:options.map(s=>s.split('|')),timeframe,context,note,coverage,privacy,ui:ui.split('|')});
export default {
zh:pack(`感到紧张、焦虑或坐立不安
无法停止或控制担忧
感到情绪低落、抑郁或绝望
做事时缺乏兴趣或乐趣
你有多常觉得难以应付日常事务？
睡眠不好有多常让你白天过得更困难？
当你生气时，以下哪种反应最常符合你的情况？
这些困难对你的工作、家庭生活或人际关系影响有多大？
最近生活中的哪个方面让你感到最沉重？
你最希望在哪方面获得支持？`,
`完全没有|有几天|超过一半的天数|几乎每天`,[
`我先停一下再回应|我保持沉默或走开|我提高音量或立即作出反应|情况不一／我没有感到生气`,
`完全没有|一点|相当大|非常大`,
`工作或生意|家庭或家人|人际关系|多个方面／没有特别的方面`,
`更平静地回应|休息和作息|把事情说开|我还不确定`],
`在过去两周内，以下问题有多常困扰你？`,
`过去两周 · 仅作为背景信息，不计入筛查分数。`,
`这是编辑翻译，尚未在本应用中获得独立验证。本工具不作诊断。`,
`全部46道问题和选项均提供中文。首页和详细报告目前提供英语和印地语版本。`,
`你的回答只保存在此浏览器中。回来继续时，新的回答也会保存。使用此浏览器的其他人可能看到这些回答，请使用私人设备。你可以在首页删除草稿。不会同步到其他设备。`,
`已完成|不想回答|已跳过 · 仍可选择答案|已保存在此浏览器|保存失败。请保持此页面打开。|请在本次问卷中保持使用同一种语言。|保存到此处并休息|删除草稿|已完成的问题|你的小小旅程`),
ja:pack(`緊張、不安、または落ち着かなさを感じる
心配することを止めたり、抑えたりできない
気分が落ち込む、憂うつになる、または希望がないと感じる
物事への興味や楽しみがほとんどない
日常の用事に対処するのが難しいと、どのくらい感じましたか？
よく眠れなかったことで、日中がつらくなったことはどのくらいありましたか？
怒りを感じたとき、最もよく当てはまった反応はどれですか？
こうした困難は、仕事、家庭生活、人間関係にどの程度影響しましたか？
最近、生活のどの部分が最も重荷に感じられましたか？
どのようなことについて最も支えがほしいですか？`,
`全くない|数日|半分以上の日|ほとんど毎日`,[
`返事をする前に一呼吸おいた|黙ったり、その場を離れたりした|声を荒げたり、すぐに反応したりした|その時による／怒りを感じなかった`,
`全くない|少し|かなり|とても大きい`,
`仕事や事業|家庭や家族|人間関係|複数の分野／特にない`,
`より穏やかに反応すること|休息と生活リズム|話して整理すること|まだわからない`],
`過去2週間、次の問題にどのくらい悩まされましたか？`,
`過去2週間 · 背景情報のみで、スクリーニングの得点には含まれません。`,
`編集上の翻訳であり、このアプリで独立した妥当性検証は行われていません。診断ではありません。`,
`46問すべてと回答の選択肢は日本語です。ホームページと詳しいレポートは英語とヒンディー語で利用できます。`,
`回答はこのブラウザーだけに保存されます。再開後の新しい回答も保存されます。同じブラウザーを使う人に見られる可能性があるため、個人用の端末を使ってください。下書きはホームページから削除できます。他の端末には同期されません。`,
`完了|回答しない|スキップ済み · 後から回答できます|このブラウザーに保存済み|保存できませんでした。このページを開いたままにしてください。|このチェックインでは同じ言語を使ってください。|ここに保存して休憩する|下書きを削除|回答済みの質問|あなたの小さな歩み`),
ko:pack(`긴장하거나 불안하거나 안절부절못함
걱정을 멈추거나 조절할 수 없음
기분이 가라앉거나 우울하거나 희망이 없다고 느낌
일을 하는 데 흥미나 즐거움이 거의 없음
일상적인 요구를 감당하기 어렵다고 얼마나 자주 느꼈나요?
잠을 잘 못 자서 하루가 힘들었던 적이 얼마나 자주 있었나요?
화가 났을 때 가장 자주 보인 반응은 무엇이었나요?
이러한 어려움이 일, 가정 또는 관계에 얼마나 영향을 주었나요?
최근 삶의 어느 부분이 가장 버겁게 느껴졌나요?
어떤 부분에서 가장 도움을 받고 싶나요?`,
`전혀 없음|며칠 동안|절반 이상의 날|거의 매일`,[
`반응하기 전에 잠시 멈췄음|말을 하지 않거나 자리를 피했음|목소리를 높이거나 즉시 반응했음|상황마다 달랐음 / 화가 나지 않았음`,
`전혀 없음|조금|상당히|매우 많이`,
`일 또는 사업|가정 또는 가족|관계|여러 영역 / 특별히 없음`,
`더 차분한 반응|휴식과 생활 습관|대화로 풀어 보기|아직 잘 모르겠음`],
`지난 2주 동안 다음 문제로 얼마나 자주 불편함을 느꼈나요?`,
`지난 2주 · 참고 정보이며 선별 점수에는 포함되지 않습니다.`,
`이 앱에서 독립적으로 검증되지 않은 편집 번역입니다. 진단이 아닙니다.`,
`46개 질문과 답변 선택지를 한국어로 제공합니다. 홈페이지와 상세 보고서는 영어와 힌디어로 제공됩니다.`,
`답변은 이 브라우저에만 저장됩니다. 다시 시작한 뒤의 새 답변도 저장됩니다. 같은 브라우저를 사용하는 다른 사람이 볼 수 있으므로 개인 기기를 사용하세요. 홈페이지에서 임시 저장 내용을 삭제할 수 있습니다. 다른 기기와 동기화되지 않습니다.`,
`완료|답변하지 않겠음|건너뜀 · 나중에 답할 수 있음|이 브라우저에 저장됨|저장하지 못했습니다. 이 페이지를 열어 두세요.|이번 체크인에서는 같은 언어를 사용하세요.|여기에 저장하고 쉬기|임시 저장 삭제|답변한 질문|나의 작은 여정`),
id:pack(`Merasa gugup, cemas, atau sangat tegang
Tidak bisa berhenti atau mengendalikan kekhawatiran
Merasa murung, tertekan, atau putus asa
Kurang berminat atau menikmati berbagai kegiatan
Seberapa sering tuntutan sehari-hari terasa sulit ditangani?
Seberapa sering tidur yang buruk membuat hari Anda lebih sulit?
Saat merasa marah, respons mana yang paling sering sesuai dengan Anda?
Seberapa besar kesulitan ini memengaruhi pekerjaan, rumah, atau hubungan Anda?
Bagian kehidupan mana yang terasa paling berat belakangan ini?
Dalam hal apa Anda paling ingin mendapatkan dukungan?`,
`Tidak pernah|Beberapa hari|Lebih dari separuh hari|Hampir setiap hari`,[
`Saya berhenti sejenak sebelum merespons|Saya diam atau menjauh|Saya meninggikan suara atau langsung bereaksi|Berbeda-beda / Saya tidak merasa marah`,
`Tidak sama sekali|Sedikit|Cukup besar|Sangat besar`,
`Pekerjaan atau usaha|Rumah atau keluarga|Hubungan|Beberapa bidang / Tidak ada yang khusus`,
`Respons yang lebih tenang|Istirahat dan rutinitas|Membicarakannya|Saya belum yakin`],
`Selama dua minggu terakhir, seberapa sering Anda terganggu oleh masalah berikut?`,
`Dua minggu terakhir · Hanya konteks, bukan bagian dari skor skrining.`,
`Terjemahan editorial yang belum divalidasi secara independen dalam aplikasi ini. Bukan diagnosis.`,
`Semua 46 pertanyaan dan pilihan jawaban tersedia dalam bahasa Indonesia. Beranda dan laporan terperinci tersedia dalam bahasa Inggris dan Hindi.`,
`Jawaban Anda hanya disimpan di browser ini. Saat Anda kembali, jawaban baru juga akan disimpan. Orang lain yang memakai browser ini dapat membacanya. Gunakan perangkat pribadi. Draf dapat dihapus dari beranda. Tidak tersinkron ke perangkat lain.`,
`selesai|Saya memilih tidak menjawab|Dilewati · Anda masih bisa menjawab|Tersimpan di browser ini|Gagal menyimpan. Biarkan halaman ini terbuka.|Gunakan bahasa yang sama selama pemeriksaan ini.|Simpan di sini dan istirahat|Hapus draf|Pertanyaan selesai|Perjalanan kecil Anda`),
vi:pack(`Cảm thấy lo lắng, bồn chồn hoặc căng thẳng
Không thể ngừng hoặc kiểm soát sự lo lắng
Cảm thấy buồn bã, chán nản hoặc tuyệt vọng
Ít hứng thú hoặc niềm vui khi làm mọi việc
Bạn thấy khó xoay xở với những yêu cầu hằng ngày thường xuyên đến mức nào?
Giấc ngủ không tốt khiến ngày của bạn khó khăn hơn thường xuyên đến mức nào?
Khi tức giận, phản ứng nào thường giống bạn nhất?
Những khó khăn này ảnh hưởng đến công việc, gia đình hoặc các mối quan hệ đến mức nào?
Gần đây, phần nào trong cuộc sống khiến bạn thấy nặng nề nhất?
Bạn muốn được hỗ trợ nhất về điều gì?`,
`Không ngày nào|Vài ngày|Hơn một nửa số ngày|Gần như mỗi ngày`,[
`Tôi dừng lại trước khi phản hồi|Tôi im lặng hoặc rời đi|Tôi lớn tiếng hoặc phản ứng ngay|Tùy lúc / Tôi không thấy tức giận`,
`Không ảnh hưởng|Một chút|Khá nhiều|Rất nhiều`,
`Công việc hoặc kinh doanh|Nhà cửa hoặc gia đình|Các mối quan hệ|Nhiều lĩnh vực / Không có lĩnh vực cụ thể`,
`Phản ứng bình tĩnh hơn|Nghỉ ngơi và sinh hoạt|Nói chuyện để hiểu vấn đề|Tôi chưa chắc`],
`Trong hai tuần qua, vấn đề sau đây làm phiền bạn thường xuyên đến mức nào?`,
`Hai tuần qua · Chỉ để hiểu hoàn cảnh, không tính vào điểm sàng lọc.`,
`Bản dịch biên tập chưa được kiểm định độc lập trong ứng dụng này. Đây không phải chẩn đoán.`,
`Cả 46 câu hỏi và các lựa chọn đều có bằng tiếng Việt. Trang chủ và báo cáo chi tiết có bằng tiếng Anh và tiếng Hindi.`,
`Câu trả lời chỉ được lưu trong trình duyệt này. Khi quay lại, câu trả lời mới cũng được lưu. Người khác dùng cùng trình duyệt có thể đọc được. Hãy dùng thiết bị cá nhân. Bạn có thể xóa bản nháp ở trang chủ. Không đồng bộ sang thiết bị khác.`,
`hoàn thành|Tôi không muốn trả lời|Đã bỏ qua · Bạn vẫn có thể trả lời|Đã lưu trong trình duyệt này|Không lưu được. Hãy giữ trang này mở.|Hãy dùng cùng một ngôn ngữ trong lần làm này.|Lưu tại đây và nghỉ|Xóa bản nháp|Câu hỏi đã hoàn thành|Hành trình nhỏ của bạn`)
};
