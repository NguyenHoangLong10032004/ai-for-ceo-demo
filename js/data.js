/* =========================================================
   DATA — nội dung khóa học AI for CEO
   Đội nội dung chỉ cần sửa file này để đổi: module, video, bài tập,
   giá, ngành, phòng ban, lịch Live Zoom. Không chứa logic giao diện.
   ========================================================= */

/* ---------- icon (SVG inline) ---------- */
const I={
users:'<path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1"/><circle cx="9" cy="7" r="3.5"/><path d="M22 19v-1a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>',
chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z"/>',
bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
x:'<path d="M6 6l12 12M18 6L6 18"/>',
arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
play:'<path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor"/>',
video:'<rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
send:'<path d="M4 12l16-8-6 16-2.5-6.5L4 12Z"/>',
award:'<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',
refresh:'<path d="M20 11a8 8 0 0 0-14.9-3M4 5v3h3M4 13a8 8 0 0 0 14.9 3M20 19v-3h-3"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
headset:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
tag:'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
chev:'<path d="m9 6 6 6-6 6"/>',
bot:'<rect x="4" y="8" width="16" height="12" rx="3.5"/><path d="M12 8V5"/><circle cx="12" cy="3.5" r="1.5"/><circle cx="9" cy="14" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.3" fill="currentColor" stroke="none"/><path d="M2 12.5v3M22 12.5v3"/>',
mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
code:'<path d="m8 8-5 4 5 4M16 8l5 4-5 4M14 4l-4 16"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
zap:'<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
shield:'<path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6l-8-3Z"/>',
map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
download:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
fb:'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v7h4v-7h3l1-4h-4V8Z" fill="currentColor" stroke="none"/>',
star:'<path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.8Z" fill="currentColor" stroke="none"/>',
flame:'<path d="M12 2c1 3.5 5 5.6 5 10.5A5 5 0 0 1 12 22a5 5 0 0 1-5-5c0-2.4 1.3-3.9 2.5-5 .3 1.6 1.1 2.6 2 3 0-3.5-1-6.3.5-13Z" fill="currentColor" stroke="none"/>',
thumb:'<path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3Zm0 0 4-7a2 2 0 0 1 2.9 2.2L13 10h6a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 21H7"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'
};
const ic=(n,s=18)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]||''}</svg>`;

/* ---------- danh mục dùng trong onboarding ---------- */
const GOALS={sales:'Sales',marketing:'Marketing',cs:'CSKH',hr:'Nhân sự',finance:'Tài chính',ops:'Vận hành',ceo:'Văn phòng CEO'};
const LEVELS={1:'Chủ yếu nghe qua tin tức',2:'Đã thử chatbot AI vài lần',3:'Dùng AI thường xuyên trong công việc',4:'Công ty đã đưa AI vào quy trình'};
const INDUSTRIES=['Bán lẻ & phân phối','Sản xuất','Dịch vụ B2B','Giáo dục & đào tạo','F&B & dịch vụ','Khác'];
const SIZES=['Dưới 20 người','20–50 người','50–200 người','Trên 200 người'];
const CAPS=['Đọc & hiểu','Nhìn & nghe','Tạo nội dung','Nghiên cứu & phân tích','Xây phần mềm','Kết nối hệ thống','Tự động hóa','AI Agent'];
// Ví dụ theo ngành: câu mô tả chung + 3 use case gợi ý (dùng cho bài tập Module 12)
const IND={
 'Bán lẻ & phân phối':{general:'trả lời khách về giá, tồn kho và tổng hợp doanh thu từng cửa hàng',uc:[['Trợ lý trả lời tin nhắn khách hỏi giá, tồn kho','cs','Kết nối hệ thống'],['Báo cáo doanh thu từng cửa hàng tự động mỗi sáng','finance','Tự động hóa'],['Tìm nguyên nhân khi chi phí quảng cáo tăng','marketing','Nghiên cứu & phân tích']]},
 'Sản xuất':{general:'tổng hợp báo cáo ca, tra cứu tiêu chuẩn kỹ thuật và soạn báo giá',uc:[['Biên bản giao ban ca tự động kèm việc cần làm','ops','Nhìn & nghe'],['Hỏi đáp tiêu chuẩn kỹ thuật, quy trình sản xuất','ops','Đọc & hiểu'],['Soạn báo giá OEM từ yêu cầu của khách','sales','Tạo nội dung']]},
 'Dịch vụ B2B':{general:'soạn proposal, tóm tắt họp khách hàng và chấm điểm lead',uc:[['Soạn proposal từ biên bản họp khách hàng','sales','Tạo nội dung'],['Trợ lý nội bộ trả lời từ kho tài liệu dự án','ops','Đọc & hiểu'],['Chấm điểm và phân loại lead mới tự động','sales','Tự động hóa']]},
 'Giáo dục & đào tạo':{general:'tư vấn tuyển sinh ngoài giờ và soạn học liệu',uc:[['Tư vấn tuyển sinh qua tin nhắn ngoài giờ','cs','Kết nối hệ thống'],['Soạn học liệu, bài tập từ giáo trình','ops','Tạo nội dung'],['Phân tích lý do học viên bỏ học','ceo','Nghiên cứu & phân tích']]},
 'F&B & dịch vụ':{general:'nhận đặt bàn, đọc đánh giá khách và kiểm tra chi nhánh qua ảnh',uc:[['Nhận đặt bàn, trả lời menu qua tin nhắn','cs','Kết nối hệ thống'],['Phân tích đánh giá khách trên mạng mỗi tuần','marketing','Nghiên cứu & phân tích'],['Kiểm tra ảnh vệ sinh, trưng bày các chi nhánh','ops','Nhìn & nghe']]},
 'Khác':{general:'trả lời câu hỏi lặp lại và tổng hợp báo cáo quản trị',uc:[['Trợ lý trả lời câu hỏi lặp lại của khách','cs','Kết nối hệ thống'],['Báo cáo quản trị tự động mỗi tuần','finance','Tự động hóa'],['Hỏi đáp quy trình nội bộ cho nhân viên mới','hr','Đọc & hiểu']]}
};

/* ---------- cấu trúc khóa học ---------- */
const PHASES=[
 {id:'P1',name:'AI biết & hiểu'},{id:'P2',name:'AI tạo & suy luận'},{id:'P3',name:'AI xây & dùng công cụ'},{id:'P4',name:'AI hành động'},{id:'P5',name:'Áp vào doanh nghiệp'}
];
const PARTS=['Mở vấn đề','Demo năng lực','Giải thích cho CEO','CEO takeaway'];
const REVIEW_MIN=8;
/* LIB: 12 module bắt buộc (M01–M12, mỗi module 4 video: parts = số phút video A–D)
   + case/live tùy chọn (X1–X7) để cá nhân hóa theo phòng ban (tags) và mức AI. */
const M=(o)=>Object.assign({type:'module',req:true,tags:[]},o);
const LIB=[
 M({id:'M01',no:1,phase:'P1',cap:'Toàn cảnh',title:'AI hiện tại đã đi xa đến đâu?',why:'Mở đầu: AI 2026 khác AI vài năm trước ở đâu',parts:[3,8,5,2],
  hook:'Nếu lần cuối anh/chị thử AI là một năm trước, hình dung về AI của anh/chị có thể đã lỗi thời.',
  demo:'Một yêu cầu đi xuyên văn bản, file Excel, hình ảnh, web và hành động: AI đọc báo cáo bán hàng, xem ảnh kệ hàng, tra giá đối thủ trên web rồi soạn email đề xuất cho trưởng vùng.',
  body:['Từ chatbot đến agent, AI đã đi qua bốn nấc: chatbot trả lời câu hỏi; AI đa phương thức đọc được ảnh, file, giọng nói; AI suy luận biết tự chia bài toán; và AI agent biết dùng công cụ để hành động.','Khác biệt lớn nhất của "AI 2026": nó không chỉ trả lời mà có thể làm việc trên dữ liệu và hệ thống của doanh nghiệp, khi được cấp quyền.'],
  take:'AI không còn chỉ là chatbot.',qs:['Công ty mình đang dùng AI ở nấc nào trong bốn nấc này?','Ai trong công ty đang theo sát các thay đổi của AI?','Quyết định nào của mình đang dựa trên hình dung cũ về AI?'],
  ex:[['ceo','Ban giám đốc cập nhật lại kỳ vọng về AI trước khi duyệt ngân sách năm'],['sales','Thấy AI tự soạn đề xuất cho khách từ dữ liệu bán hàng'],['ops','Thấy AI xử lý ảnh, file và web trong cùng một yêu cầu']]}),
 {id:'X1',type:'case',phase:'P1',title:'Ôn nhanh: AI tạo sinh là gì, nói bằng ngôn ngữ kinh doanh',min:10,req:false,tags:[],skipIfLevel:2,
  hook:'AI "biết" mọi thứ từ đâu, và vì sao đôi khi nó nói sai?',demo:'Giải thích bằng hình ảnh: AI học từ lượng văn bản khổng lồ, đoán câu trả lời hợp lý nhất, và vì sao cần cung cấp dữ liệu của công ty.',
  body:['Không cần hiểu kỹ thuật. Chỉ cần nhớ: AI giỏi ở ngôn ngữ và nhận dạng mẫu; nó trả lời tốt hơn nhiều khi được cung cấp đúng tài liệu của doanh nghiệp.'],take:'AI giỏi đến đâu phụ thuộc nhiều vào dữ liệu anh/chị đưa cho nó.'},
 M({id:'M02',no:2,phase:'P1',cap:'Đọc & hiểu',title:'AI có thể ĐỌC & HIỂU',why:'Năng lực dùng được ngay, rủi ro thấp nhất',parts:[3,6,5,2],
  hook:'Với 200 trang hợp đồng và báo cáo, AI có tìm ra 3 điều CEO cần biết trong 5 phút không?',
  demo:'Đưa AI 12 hợp đồng đại lý, báo cáo quý và SOP bán hàng; hỏi "Đại lý nào đang được chiết khấu vượt chính sách?". AI trả lời kèm trích dẫn đúng trang.',
  body:['AI đọc được hàng trăm trang tài liệu, bảng biểu, email, SOP và trả lời câu hỏi có dẫn nguồn.','Giới hạn: AI chỉ tốt khi tài liệu đủ và đúng. Câu trả lời quan trọng vẫn cần người kiểm tra lại trích dẫn.'],
  take:'Tài liệu nội bộ là nơi đầu tiên AI tạo ra giá trị.',qs:['Tài liệu nào trong công ty ít người đọc nhưng chứa nhiều thông tin quan trọng?','Mỗi tuần quản lý mất bao nhiêu giờ để tìm thông tin?','Tài liệu nào không được phép đưa cho AI?'],
  ex:[['sales','Tra nhanh chính sách giá, chiết khấu cho từng đại lý'],['hr','Nhân viên mới hỏi đáp nội quy thay vì hỏi quản lý'],['finance','Rà hợp đồng để tìm điều khoản phạt, công nợ bất thường']]}),
 M({id:'M03',no:3,phase:'P1',cap:'Nhìn & nghe',title:'AI có thể NHÌN & NGHE',why:'Biến họp, cuộc gọi, hình ảnh thành dữ liệu',parts:[3,7,4,1],
  hook:'Cuộc họp 60 phút hôm qua có ai ghi lại đủ quyết định và người chịu trách nhiệm không?',
  demo:'AI nghe bản ghi buổi giao ban, tự tạo biên bản, danh sách quyết định và việc cần làm theo từng người; sau đó xem ảnh kệ hàng và chỉ ra sản phẩm bị trưng bày sai.',
  body:['AI hiểu ảnh, video, giọng nói và cuộc gọi: chuyển lời nói thành văn bản, tóm tắt, nhận diện vấn đề trong hình ảnh.','Giới hạn: âm thanh kém, nhiều người nói cùng lúc hoặc hình ảnh chuyên ngành làm giảm độ chính xác.'],
  take:'Mọi cuộc họp, cuộc gọi và hình ảnh hiện trường đều có thể trở thành dữ liệu.',qs:['Cuộc họp nào đang không có biên bản và việc cần làm rõ ràng?','Cuộc gọi khách hàng có được nghe lại để cải thiện chất lượng không?','Hình ảnh nào từ hiện trường mình muốn được phân tích tự động?'],
  ex:[['ceo','Biên bản giao ban tự động kèm việc cần làm theo từng người'],['cs','Nghe lại toàn bộ cuộc gọi CSKH để tìm khiếu nại lặp lại'],['ops','Kiểm tra ảnh trưng bày, kho bãi từ chi nhánh gửi về']]}),
 M({id:'M04',no:4,phase:'P2',cap:'Tạo nội dung',title:'AI có thể TẠO',why:'Thấy chi phí sản xuất nội dung giảm thế nào',parts:[3,9,4,2],
  hook:'Từ một bản mô tả sản phẩm, mất bao lâu để có hình ảnh, video, bài viết và landing page?',
  demo:'Từ brief sản phẩm 5 dòng, AI tạo concept, bộ ảnh key visual, video quảng cáo 15 giây có lồng tiếng, bài đăng và một landing page trong một buổi.',
  body:['AI tạo được văn bản, hình ảnh, video, giọng nói, slide và trang web. Thời gian và chi phí sản xuất nội dung giảm mạnh.','Giới hạn: bản quyền, tính nhất quán thương hiệu và độ chính xác thông tin vẫn cần người duyệt.'],
  take:'Nút thắt không còn là sản xuất nội dung mà là ý tưởng và khả năng duyệt nhanh.',qs:['Công ty đang tốn bao nhiêu cho sản xuất nội dung mỗi tháng?','Ai duyệt nội dung AI tạo ra trước khi đăng?','Hướng dẫn thương hiệu đã đủ rõ để AI làm theo chưa?'],
  ex:[['marketing','Ra 20 phiên bản quảng cáo để thử thay vì 2'],['sales','Tạo slide đề xuất riêng cho từng khách hàng lớn'],['hr','Làm video đào tạo nhân viên mới có lồng tiếng']]}),
 M({id:'M05',no:5,phase:'P2',cap:'Nghiên cứu & phân tích',title:'AI có thể NGHIÊN CỨU & PHÂN TÍCH',why:'AI như một chuyên viên phân tích luôn sẵn sàng',parts:[3,7,4,2],
  hook:'"Vì sao doanh thu kênh đại lý giảm quý này?" AI có tự tìm ra nguyên nhân không?',
  demo:'Một câu hỏi kinh doanh: AI nghiên cứu đối thủ trên web, đọc dữ liệu bán hàng, so sánh phương án, tổng hợp nguồn và đưa ra 3 khuyến nghị có lý giải.',
  body:['AI suy luận nhiều bước: đặt giả thuyết, tìm dữ liệu kiểm chứng, so sánh phương án, làm phần việc của một chuyên viên phân tích trong vài phút.','Giới hạn: AI có thể tự tin kết luận sai khi dữ liệu thiếu. CEO cần hỏi "dựa vào nguồn nào" trước khi dùng kết quả để quyết định.'],
  take:'AI trả lời rất nhanh, nhưng CEO vẫn là người đặt câu hỏi đúng.',qs:['Câu hỏi kinh doanh nào mình muốn có câu trả lời mỗi tuần?','Dữ liệu để trả lời câu hỏi đó đang nằm ở đâu?','Ai sẽ kiểm chứng kết luận của AI?'],
  ex:[['ceo','Nghiên cứu nhanh thị trường mới trước khi quyết định mở rộng'],['marketing','Theo dõi và so sánh chiến dịch của đối thủ'],['finance','Giải thích biến động chi phí so với cùng kỳ']]}),
 M({id:'M06',no:6,phase:'P3',cap:'Xây phần mềm',title:'AI có thể XÂY',why:'Thấy AI xây phần mềm từ mô tả nghiệp vụ',parts:[3,10,5,2],
  hook:'Nếu CEO chỉ mô tả bằng lời, AI có xây được một dashboard dùng được không?',
  demo:'CEO nói: "Tôi cần một trang theo dõi doanh số theo chi nhánh". Một công cụ AI lập trình (ví dụ Claude Code hoặc Codex) xây prototype, CEO góp ý, AI sửa và chạy thử ngay.',
  body:['AI không chỉ trả lời, nó tạo được website, app, dashboard, phần mềm nội bộ từ mô tả nghiệp vụ. Từ ý tưởng đến bản chạy thử rút từ vài tháng xuống vài giờ.','Giới hạn: prototype khác sản phẩm vận hành thật. Bảo mật, dữ liệu thật và bảo trì vẫn cần đội kỹ thuật.'],
  take:'Ý tưởng phần mềm của CEO có thể được thử nghiệm trong một buổi chiều.',qs:['Công cụ nội bộ nào công ty muốn có từ lâu nhưng chưa làm?','Ai chịu trách nhiệm khi prototype thành hệ thống thật?','Mình có đang trả tiền cho phần mềm mà AI có thể xây riêng không?'],
  ex:[['ceo','Dashboard doanh số theo chi nhánh trong một buổi chiều'],['ops','Ứng dụng check-list kiểm tra cửa hàng'],['sales','Công cụ tính báo giá nhanh cho nhân viên kinh doanh']]}),
 M({id:'M07',no:7,phase:'P3',cap:'Kết nối hệ thống',title:'AI có thể KẾT NỐI & DÙNG CÔNG CỤ',why:'Bước AI chuyển từ "nói" sang "làm"',parts:[3,7,4,2],
  hook:'AI có tự vào CRM, Google Ads hay Drive để lấy đúng số liệu CEO cần không?',
  demo:'Kết nối AI với Meta Ads, CRM và Google Drive qua connector/MCP; CEO hỏi "Tuần này kênh nào mang về khách hàng rẻ nhất?", AI tự lấy số liệu từ ba hệ thống và trả lời.',
  body:['Khi được cấp quyền qua API, connector hoặc MCP, AI dùng được hệ thống bên ngoài: CRM, quảng cáo, lịch, cơ sở dữ liệu.','Giới hạn: cấp quyền là quyết định quản trị. Cần nguyên tắc rõ: AI được đọc gì, được sửa gì, ai phê duyệt.'],
  take:'AI đang trở thành một lớp trí tuệ nằm trên các hệ thống doanh nghiệp.',qs:['Dữ liệu công ty đang nằm rải rác ở những hệ thống nào?','Mình muốn AI chỉ đọc, hay được phép thay đổi dữ liệu?','Ai trong công ty quản lý quyền truy cập?'],
  ex:[['marketing','Hỏi số liệu quảng cáo nhiều kênh bằng một câu'],['sales','AI đọc CRM để nhắc khách lâu chưa được chăm sóc'],['ceo','Báo cáo tổng hợp từ nhiều hệ thống, không chờ tổng hợp tay']]}),
 M({id:'M08',no:8,phase:'P4',cap:'Tự động hóa',title:'AI có thể TỰ ĐỘNG HÓA CÔNG VIỆC',why:'Quy trình nhiều bước chạy tự động, có kiểm soát',parts:[3,7,4,2],
  hook:'Khi có khách hàng tiềm năng mới lúc 11 giờ đêm, ai xử lý?',
  demo:'Lead mới vào → AI tra cứu thông tin công ty → chấm điểm → cập nhật CRM → gửi email cá nhân hóa → tạo việc cho nhân viên sales. Không ai phải bấm nút.',
  body:['Nhiều bước AI được ghép thành quy trình có điểm kích hoạt, logic, dữ liệu và hành động, chạy cả ngày lẫn đêm.','Giới hạn: tự động hóa một quy trình lộn xộn chỉ làm nó lộn xộn nhanh hơn. Cần chuẩn hóa quy trình và giữ điểm con người kiểm tra.'],
  take:'Quy trình nào có quy tắc rõ ràng đều có thể giao cho AI chạy.',qs:['Quy trình nào đang phụ thuộc vào việc một người nhớ làm?','Bước nào cần con người phê duyệt?','Nếu tự động hóa sai, thiệt hại lớn nhất là gì?'],
  ex:[['sales','Lead mới được chấm điểm và chuyển đúng người trong 1 phút'],['cs','Tự phân loại và trả lời yêu cầu hỗ trợ đơn giản'],['finance','Tự đối chiếu hóa đơn với đơn hàng và báo sai lệch']]}),
 {id:'X3',type:'case',phase:'P4',title:'Case: Trợ lý CSKH trả lời khách 24/7',min:12,req:false,tags:['cs','sales'],
  hook:'Bao nhiêu đơn hàng đang mất vì tin nhắn được trả lời quá chậm?',demo:'Trợ lý AI được nối với tồn kho và chính sách: trả lời giá, tình trạng đơn, giao hàng; chuyển cho nhân viên khi khách phàn nàn.',
  body:['Kết hợp năng lực Đọc & hiểu, Kết nối và Tự động hóa. Giá trị đo được: thời gian phản hồi, tỷ lệ chốt ngoài giờ, số tin nhắn nhân viên phải xử lý.'],take:'CSKH thường là nơi AI tạo giá trị nhanh và dễ đo nhất.'},
 {id:'X4',type:'case',phase:'P4',title:'Case: Báo cáo quản trị tự động mỗi sáng',min:12,req:false,tags:['finance','ops','ceo'],
  hook:'CEO có cần chờ đến thứ Hai mới biết tuần trước kinh doanh thế nào?',demo:'Mỗi 7 giờ sáng, AI lấy số liệu bán hàng, chi phí, tồn kho, viết báo cáo 1 trang kèm giải thích biến động và gửi vào nhóm ban giám đốc.',
  body:['Kết hợp Kết nối hệ thống, Phân tích và Tự động hóa. Giá trị: quyết định nhanh hơn, bớt giờ tổng hợp tay của kế toán và vận hành.'],take:'Báo cáo tốt nhất là báo cáo tự đến trước khi CEO hỏi.'},
 M({id:'M09',no:9,phase:'P4',cap:'AI Agent',title:'AI có thể trở thành AGENT',why:'Nấc cao nhất của AI hiện tại',parts:[3,9,4,2],
  hook:'Nếu giao một mục tiêu thay vì một câu lệnh, AI có tự hoàn thành không?',
  demo:'Giao cho agent: "Chuẩn bị báo cáo hiệu quả marketing tuần và đề xuất điều chỉnh". Agent tự lấy dữ liệu quảng cáo, phân tích, viết báo cáo, tạo task cho team và xin CEO duyệt trước khi đổi ngân sách.',
  body:['Agent nhận mục tiêu, tự chia bước, dùng công cụ, tự kiểm tra rồi trả kết quả hoặc hành động.','Giới hạn: agent cần phạm vi rõ, quyền hạn giới hạn và điểm phê duyệt. Mục tiêu mơ hồ thì kết quả cũng mơ hồ.'],
  take:'Giao việc cho agent như giao cho một nhân sự mới: rõ mục tiêu, rõ quyền, rõ điểm báo cáo.',qs:['Nhiệm vụ đầu-cuối nào có thể giao cho một agent thử?','Agent cần những quyền gì, và không được có quyền gì?','Điểm nào agent bắt buộc phải xin phê duyệt?'],
  ex:[['marketing','Agent theo dõi quảng cáo và đề xuất điều chỉnh ngân sách mỗi sáng'],['ceo','Agent chuẩn bị tài liệu trước mỗi cuộc họp ban giám đốc'],['hr','Agent sàng lọc hồ sơ và đặt lịch phỏng vấn']]}),
 {id:'X2',type:'case',phase:'P4',title:'Case xuyên suốt: AI + Quảng cáo, từ kết nối đến agent',min:20,req:false,tags:['marketing','ceo'],
  hook:'Tại sao tuần này chi phí mỗi khách hàng (CPA) tăng 28%?',demo:'Kết nối AI với Meta Ads, Google Ads → đọc Spend, Revenue, CPL, CPA, ROAS → tìm nguyên nhân CPA tăng → xây dashboard theo dõi → mỗi sáng tự cảnh báo khi vượt ngưỡng → agent tự tạo task cho team Marketing.',
  body:['Một bài toán đi qua 6 năng lực: Kết nối, Hiểu dữ liệu, Suy luận, Xây, Tự động hóa, Agent. Đây là cách AI trở thành lớp trí tuệ nằm trên hệ thống quảng cáo.'],take:'Cùng một bài toán, AI có thể tham gia từ trả lời câu hỏi đến tự hành động.'},
 M({id:'M10',no:10,phase:'P5',cap:'Theo phòng ban',title:'AI trong TỪNG PHÒNG BAN',why:'Ghép các năng lực vào từng phòng ban',parts:[2,7,5,2],
  hook:'Mỗi phòng ban trong công ty anh/chị có thể dùng những năng lực vừa xem như thế nào?',
  demo:'Bản đồ năng lực × phòng ban: Sales, Marketing, CSKH, Nhân sự, Tài chính, Vận hành, Văn phòng CEO; mỗi ô là một ví dụ đã chạy được.',
  body:['AI không giới hạn ở nội dung marketing. Mỗi phòng ban có việc đọc, phân tích, tạo, kết nối và tự động hóa riêng.','Cách nhìn đúng: bắt đầu từ bài toán của từng phòng ban, không bắt đầu từ công cụ.'],
  take:'Mỗi trưởng phòng nên được hỏi: "Việc nào của phòng mình AI làm được?"',qs:['Phòng ban nào đang quá tải nhất?','Trưởng phòng nào sẵn sàng thử AI trước?','Phòng ban nào có dữ liệu tốt nhất để bắt đầu?'],
  ex:[['cs','CSKH: trả lời, phân loại, phân tích khiếu nại'],['finance','Tài chính: đối chiếu, báo cáo, dự báo dòng tiền'],['hr','Nhân sự: tuyển dụng, đào tạo, hỏi đáp chính sách']]}),
 {id:'X5',type:'case',phase:'P5',title:'Case: AI trong tuyển dụng & đào tạo',min:12,req:false,tags:['hr'],
  hook:'Mất bao lâu để một nhân viên mới làm việc được?',demo:'AI viết mô tả công việc, sàng lọc hồ sơ theo tiêu chí, soạn tài liệu đào tạo và làm trợ lý hỏi đáp chính sách cho nhân viên mới.',
  body:['AI chỉ nên xếp hạng gợi ý khi sàng lọc; người tuyển dụng vẫn là người quyết định để tránh thiên kiến.'],take:'AI rút ngắn thời gian tuyển và đào tạo, để quản lý tập trung vào giữ người giỏi.'},
 M({id:'M11',no:11,phase:'P5',cap:'Giới hạn & quản trị',title:'AI CHƯA LÀM ĐƯỢC GÌ?',why:'Phân biệt hype với năng lực thật',parts:[3,6,4,1],
  hook:'Điều gì xảy ra khi AI trả lời sai một cách rất tự tin?',
  demo:'Cho AI trả lời khi thiếu dữ liệu: nó đưa ra một con số doanh thu nghe rất hợp lý nhưng sai. Sau đó xem cách thiết lập nguồn dữ liệu, quyền truy cập và bước phê duyệt để ngăn lỗi này.',
  body:['Các giới hạn thật: ảo giác (hallucination), độ ổn định chưa tuyệt đối, rủi ro bảo mật, quyền truy cập, và câu hỏi ai chịu trách nhiệm khi AI sai.','Quản trị AI không phải để cấm, mà để dùng mạnh tay hơn một cách an toàn.'],
  take:'Phân biệt hype và năng lực thật là trách nhiệm của CEO.',qs:['Quyết định nào tuyệt đối không giao cho AI?','Công ty đã có chính sách dùng AI chưa?','Nếu AI gây lỗi với khách hàng, ai chịu trách nhiệm?'],
  ex:[['ceo','Chính sách dùng AI một trang cho toàn công ty'],['finance','Bắt buộc người duyệt mọi số liệu AI đưa ra ngoài'],['cs','AI chỉ trả lời trong phạm vi chính sách đã duyệt']]}),
 {id:'X7',type:'case',phase:'P5',title:'Quyền truy cập & phê duyệt khi AI chạm vào hệ thống',min:12,req:false,tags:[],bigOrg:true,
  hook:'Ai được quyết định AI được đọc và sửa dữ liệu nào?',demo:'Một ma trận quyền đơn giản: dữ liệu nào AI được đọc, được ghi, hành động nào cần người duyệt, và ai là người duyệt.',
  body:['Với công ty nhiều phòng ban, quyền truy cập là rào cản lớn nhất khi đưa AI vào hệ thống. Chuẩn bị từ đầu giúp triển khai nhanh hơn.'],take:'Quản trị quyền là điều kiện để AI được phép làm nhiều hơn.'},
 M({id:'M12',no:12,phase:'P5',cap:'Bắt đầu từ đâu',title:'CEO NÊN BẮT ĐẦU TỪ ĐÂU?',why:'Chọn 3 use case đáng thử nhất cho công ty',parts:[3,8,6,3],art:true,
  hook:'Sau khi thấy AI làm được tất cả những điều này, việc đầu tiên nên làm là gì?',
  demo:'Một CEO đi qua khung lựa chọn: liệt kê cơ hội, chấm theo giá trị, khả thi và dữ liệu, chọn 3 use case đáng thử, xác định quyền truy cập và người phụ trách.',
  body:['Bắt đầu nhỏ, có đo lường: chọn use case có giá trị rõ, dữ liệu sẵn có và làm được trong vài tuần.','Trước khi triển khai, xác định dữ liệu nào cần, quyền truy cập nào cần cấp, ai phụ trách và khi nào đánh giá lại.'],
  take:'Vấn đề không còn là có nên dùng AI hay không, mà là nên đưa AI vào đâu trước.',qs:['3 use case nào đáng thử nhất trong quý này?','Ai là người phụ trách từng use case?','Khi nào mình sẽ đánh giá lại kết quả?'],
  ex:[['ceo','Chọn 3 use case cho quý tới và giao người phụ trách'],['ops','Ưu tiên quy trình có dữ liệu sẵn, làm được trong 4 tuần'],['sales','Bắt đầu từ việc lặp lại nhiều nhất của đội kinh doanh']]}),
 {id:'X6',type:'live',phase:'P5',title:'Replay Live Zoom "AI đến đâu rồi?" tháng 9/2026',min:30,req:false,tags:[],adv:true,
  hook:'Tháng này AI có năng lực gì mới mà CEO cần biết?',demo:'Bản ghi buổi live gần nhất: demo năng lực mới, phân tích xu hướng và hỏi đáp trực tiếp với CEO.',
  body:['Live Zoom hằng tháng giữ cho khóa học luôn mới. Nội dung đáng chú ý được cắt bổ sung vào các module liên quan.'],take:'Cập nhật đều đặn quan trọng hơn học một lần thật nhiều.'}
];

/* ---------- bài tập: mỗi module 1 bài, nằm ngay sau video D của module ---------- */
const G=p=>(IND[p.industry]||IND['Khác']);
const TASKS={
 M01:{title:'Công ty mình đang ở nấc nào?',min:3,fields:[{k:'level',label:'Công ty anh/chị đang dùng AI ở nấc nào?',type:'select',opts:['Chưa dùng AI','Chatbot trả lời câu hỏi','AI đa phương thức (đọc file, ảnh, giọng nói)','AI suy luận, phân tích nhiều bước','AI agent tự thực hiện công việc']},{k:'note',label:'Một việc cụ thể công ty đang dùng AI, hoặc nên dùng nhưng chưa dùng',type:'textarea'}],
  sample:p=>({level:'Chatbot trả lời câu hỏi',note:`Một vài nhân viên dùng chatbot để viết nội dung, nhưng chưa ai dùng AI cho việc ${G(p).general}.`})},
 M02:{title:'Tài liệu nào AI nên đọc trước?',min:3,fields:[{k:'docs',label:'3 bộ tài liệu nội bộ anh/chị muốn AI đọc và trả lời câu hỏi trước',type:'textarea'},{k:'never',label:'Tài liệu nào tuyệt đối không đưa cho AI?',type:'text'}],
  sample:()=>({docs:'1. Chính sách giá và chiết khấu đại lý\n2. SOP bán hàng và CSKH\n3. Hợp đồng với 20 khách hàng lớn nhất',never:'Bảng lương, hồ sơ nhân sự, dữ liệu cá nhân khách hàng'})},
 M03:{title:'Họp, cuộc gọi, hình ảnh nào nên thành dữ liệu?',min:3,fields:[{k:'what',label:'Cuộc họp, cuộc gọi hoặc hình ảnh hiện trường nào nên được AI ghi lại và phân tích?',type:'textarea'},{k:'owner',label:'Ai sẽ theo dõi việc cần làm sau mỗi cuộc họp?',type:'text'}],
  sample:()=>({what:'Giao ban sáng thứ Hai của ban giám đốc; cuộc gọi khiếu nại của CSKH; ảnh trưng bày cửa hàng gửi về mỗi tuần.',owner:'Trợ lý giám đốc'})},
 M04:{title:'Nội dung nào đang tốn nhiều nhất?',min:3,fields:[{k:'cost',label:'Loại nội dung nào công ty đang tốn nhiều thời gian hoặc chi phí sản xuất nhất?',type:'textarea'},{k:'review',label:'Ai sẽ duyệt nội dung AI tạo ra trước khi đăng?',type:'text'}],
  sample:()=>({cost:'Ảnh và bài đăng cho sản phẩm mới mỗi tháng, video ngắn cho quảng cáo; hiện thuê ngoài khoảng 30 triệu mỗi tháng.',review:'Trưởng phòng Marketing'})},
 M05:{title:'Câu hỏi kinh doanh hằng tuần',min:3,fields:[{k:'q',label:'Câu hỏi kinh doanh anh/chị muốn có câu trả lời mỗi tuần',type:'text'},{k:'data',label:'Dữ liệu để trả lời câu hỏi đó đang nằm ở đâu? Ai kiểm chứng kết luận?',type:'textarea'}],
  sample:()=>({q:'Vì sao doanh thu tuần này tăng hoặc giảm so với tuần trước, theo từng kênh?',data:'Dữ liệu bán hàng trên phần mềm POS, chi phí quảng cáo trên Meta Ads. Kế toán trưởng kiểm chứng.'})},
 M06:{title:'Công cụ nội bộ muốn AI xây thử',min:3,fields:[{k:'tool',label:'Mô tả bằng lời một công cụ nội bộ anh/chị muốn AI xây thử: ai dùng, để làm gì, hiển thị gì',type:'textarea'}],
  sample:()=>({tool:'Trang dashboard cho ban giám đốc xem doanh số theo chi nhánh mỗi sáng: doanh thu hôm qua, so với cùng kỳ, 5 sản phẩm bán chạy, chi nhánh cần chú ý.'})},
 M07:{title:'Hệ thống nào AI được kết nối?',min:3,fields:[{k:'systems',label:'Liệt kê các hệ thống đang chứa dữ liệu công ty (CRM, quảng cáo, Drive, phần mềm kế toán…)',type:'textarea'},{k:'perm',label:'Anh/chị cho phép AI làm gì với các hệ thống này?',type:'select',opts:['Chỉ đọc dữ liệu','Đọc và tạo bản nháp, người duyệt mới gửi','Đọc và được phép cập nhật dữ liệu']}],
  sample:()=>({systems:'CRM (khách hàng, đơn hàng), Meta Ads và Google Ads, Google Drive (tài liệu), phần mềm kế toán.',perm:'Đọc và tạo bản nháp, người duyệt mới gửi'})},
 M08:{title:'Một quy trình có thể tự động hóa',min:3,fields:[{k:'flow',label:'Một quy trình lặp lại có quy tắc rõ ràng trong công ty, mô tả các bước',type:'textarea'},{k:'approve',label:'Bước nào bắt buộc phải có người duyệt?',type:'text'}],
  sample:()=>({flow:'Khách để lại số điện thoại trên website → phân loại theo nhu cầu → nhập CRM → gửi tin nhắn cảm ơn → giao cho nhân viên sales gọi lại trong 2 giờ.',approve:'Trước khi gửi báo giá cho khách'})},
 M09:{title:'Viết bản giao việc cho một agent',min:3,fields:[{k:'goal',label:'Mục tiêu giao cho agent',type:'text'},{k:'scope',label:'Agent được dùng hệ thống nào, không được làm gì, và phải xin duyệt ở điểm nào?',type:'textarea'}],
  sample:()=>({goal:'Mỗi thứ Hai, chuẩn bị báo cáo hiệu quả quảng cáo tuần trước và đề xuất điều chỉnh ngân sách',scope:'Được đọc Meta Ads, Google Ads, CRM. Không được tự đổi ngân sách. Phải xin Giám đốc Marketing duyệt trước khi tạo task cho team.'})},
 M10:{title:'Mỗi phòng ban một việc cho AI',min:3,fields:[{k:'map',label:'Với mỗi phòng ban anh/chị quan tâm, ghi 1 việc AI có thể làm',type:'textarea'}],
  sample:p=>({map:(p.goals&&p.goals.length?p.goals:['sales','marketing']).map(g=>`${GOALS[g]}: ${({sales:'soạn báo giá và đề xuất cho từng khách',marketing:'tìm nguyên nhân khi chi phí quảng cáo tăng',cs:'trả lời tin nhắn lặp lại ngoài giờ',hr:'sàng lọc hồ sơ và hỏi đáp nội quy',finance:'báo cáo doanh thu tự động mỗi sáng',ops:'biên bản giao ban và việc cần làm',ceo:'tóm tắt báo cáo trước họp ban giám đốc'})[g]}`).join('\n')})},
 M11:{title:'Ranh giới dùng AI của công ty',min:3,fields:[{k:'never',label:'3 quyết định tuyệt đối không giao cho AI',type:'textarea'},{k:'rule',label:'1 nguyên tắc đầu tiên cho chính sách dùng AI của công ty',type:'text'}],
  sample:()=>({never:'1. Tuyển hoặc cho nghỉ việc nhân sự\n2. Duyệt chi và ký hợp đồng\n3. Trả lời khiếu nại nghiêm trọng của khách',rule:'Mọi số liệu AI tạo ra phải có người kiểm tra trước khi gửi ra ngoài công ty.'})},
 M12:{title:'Chọn 3 use case đáng thử nhất',min:5,kind:'uc'}
};
// Thời lượng module = 4 video + bài tập
LIB.forEach(x=>{if(x.type==='module')x.min=x.parts.reduce((a,b)=>a+b,0)+TASKS[x.id].min;});
const L=Object.fromEntries(LIB.map(x=>[x.id,x]));
const TYPE_LABEL={module:'Module',case:'Case',live:'Live replay'};
const modNo=x=>String(x.no).padStart(2,'0');
const itemTitle=x=>x.type==='module'?`Module ${modNo(x)}: ${x.title}`:x.title;

/* ---------- học phí & thông tin bán hàng ---------- */
const COURSE={list:12000000,price:8800000,promo:'Ưu đãi ra mắt tháng đầu',
 perks:['12 module video demo quay sẵn, chia thành bài học theo lịch của anh/chị','12 bài tập áp dụng cho chính công ty, lưu thành bộ output mang về','Lộ trình cá nhân hóa theo số ngày muốn hoàn thành và phòng ban quan tâm','Live Zoom hằng tháng "AI đến đâu rồi?": năng lực mới, demo mới, hỏi đáp','AI Learning Assistant hỏi đáp 24/7 theo nội dung khóa học','Ưu tiên đăng ký Offline Executive Briefing','Certificate và cộng đồng CEO AI Community']};
const SAVE=COURSE.list-COURSE.price, OFF=Math.round(SAVE/COURSE.list*100);
const TOTAL_MIN=LIB.filter(x=>x.req).reduce((a,x)=>a+x.min,0);
// Phương thức thanh toán (dùng ở form đăng ký và email xác nhận)
const PAY_METHODS={qr:"Chuyển khoản QR (VietQR)",vnpay:"VNPay: ATM, ví điện tử",card:"Thẻ Visa/Mastercard",company:"Chuyển khoản công ty theo hóa đơn"};
// Thông tin Học viện dùng trong email và mục hỗ trợ. Email, hotline, địa chỉ là MINH HỌA, cần thay bằng thông tin thật
// Gửi email THẬT qua EmailJS (emailjs.com). Để trống = chỉ gửi vào Hộp thư mô phỏng.
// Lấy 3 mã trong tài khoản EmailJS: Email Services → Service ID · Email Templates → Template ID · Account → Public Key
const EMAILJS={serviceId:"",templateId:"",publicKey:""};
const ACADEMY={name:"Học viện Siêu Tăng Trưởng",sender:"no-reply@sieutangtruong.vn",support:"hotro@sieutangtruong.vn",hotline:"1900 0000",zalo:"Zalo OA Siêu Tăng Trưởng",hours:"8:00–18:00, thứ Hai đến thứ Bảy",web:"sieutangtruong.vn",address:"100 Nguyễn Văn Lượng, Gò Vấp, TP.HCM",billing:"ketoan@sieutangtruong.vn"};
// Dashboard: bản đồ 10 năng lực AI = Module 02–11 (Module 01 là khởi động, Module 12 là đích đến)
const CAP_MAP=[{id:"M02",icon:"book",color:"#1747C9"},{id:"M03",icon:"eye",color:"#0E7490"},{id:"M04",icon:"pen",color:"#DB2777"},{id:"M05",icon:"search",color:"#7C3AED"},{id:"M06",icon:"code",color:"#4F46E5"},{id:"M07",icon:"link",color:"#0F766E"},{id:"M08",icon:"zap",color:"#EA580C"},{id:"M09",icon:"bot",color:"#B45309"},{id:"M10",icon:"users",color:"#15803D"},{id:"M11",icon:"shield",color:"#DC2626"}];
// màu từng chương trên bản đồ hành trình
const PHASE_COLOR={P1:"#1747C9",P2:"#DB2777",P3:"#7C3AED",P4:"#EA580C",P5:"#15803D"};
// Góp ý sau khi hoàn thành khóa (đề xuất mới): 5 khía cạnh chấm 1–5 sao + gợi ý nhanh, điểm giới thiệu 0–10, nhận xét mở
const FEEDBACK_ASPECTS=[
 {k:"course",label:"Khóa học nói chung",hint:"Khóa học đáp ứng kỳ vọng của anh/chị đến đâu",tags:["Đúng nhu cầu của CEO","Đáng thời gian bỏ ra","Mở ra góc nhìn mới","Chưa đủ sâu"]},
 {k:"content",label:"Nội dung",hint:"Video demo, phần giải thích cho CEO, bài tập",tags:["Demo thực tế","Dễ hiểu","Bài tập sát doanh nghiệp","Video hơi dài","Cần thêm ví dụ theo ngành"]},
 {k:"system",label:"Hệ thống học",hint:"Website, lộ trình cá nhân hóa, Dashboard",tags:["Lộ trình hợp lý","Dễ sử dụng","Dashboard trực quan","Khó tìm bài học","Tải trang chậm"]},
 {k:"support",label:"Hỗ trợ & dịch vụ",hint:"Trợ lý AI, chuyên gia, chăm sóc khách hàng, Live Zoom",tags:["Trợ lý AI hữu ích","Chuyên gia phản hồi nhanh","Live Zoom bổ ích","Phản hồi còn chậm"]},
 {k:"exp",label:"Trải nghiệm tổng thể",hint:"Từ lúc đăng ký, onboarding đến khi hoàn thành",tags:["Đăng ký thuận tiện","Onboarding nhanh gọn","Có động lực học mỗi ngày","Muốn học tiếp khóa khác"]}];
const STAR_LABEL=["","Rất không hài lòng","Chưa hài lòng","Bình thường","Hài lòng","Rất hài lòng"];
const LIVE={title:'AI đến đâu rồi? · Tháng 10/2026',when:'20:00, thứ Năm 15/10/2026',len:'75 phút · Zoom'};

/* ---------- cấu hình lộ trình & demo ---------- */
const PACES=[20,30,60];   // số phút mỗi ngày học được chọn
const MAX_DAYS=60;        // số ngày hoàn thành tối đa
const SAMPLE_PROFILE={name:'Nguyễn Hoàng Long',company:'Công ty CP Phân phối Minh An',industry:'Bán lẻ & phân phối',size:'50–200 người',level:2,goals:['marketing','cs'],problem:'Chi phí quảng cáo tăng mà chưa rõ nguyên nhân; đội CSKH quá tải tin nhắn',days:15,minPerSession:30,rhythm:'daily'};
const STAGES=[['landing','Landing'],['checkout','Đăng ký'],['mycourses','Khóa học của tôi'],['onboarding','Onboarding'],['syllabus','Lộ trình'],['learn','Học'],['complete','Hoàn thành']];
