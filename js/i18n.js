/* ==========================================================================
   MOVE SYSTEM — i18n (EN / VI)
   Content extracted from "MOVE System_05Apr" deck.
   Usage:
     I18N.setLang('vi');   // or 'en'
     I18N.apply();          // swaps all [data-i18n] elements
     I18N.t('hero.title')   // get a value
   ========================================================================== */
(function(w){
  const DICT = {
    en: {
      "nav.about":      "About",
      "nav.structure":  "Structure",
      "nav.people":     "People",
      "nav.funding":    "Funding",
      "nav.tech":       "Technology",
      "nav.labs":       "Labs",

      "hero.eyebrow":   "INSTITUTE OF SMART CITY & MANAGEMENT · UEH",
      "hero.title":     "MOVE <em>System</em>",
      "hero.sub":       "Mobility-oriented, Operations, Visualization & Environment System — a flagship research and innovation platform advancing traffic safety, net-zero transport, and smart city development in Vietnam.",
      "hero.hint":      "Orbit · Hover a pillar · Click to enter",

      "about.eyebrow":  "ABOUT",
      "about.title":    "A flagship platform for applied urban research",
      "about.body1":    "MOVE System is developed by the Institute of Smart City and Management (ISCM) at the University of Economics Ho Chi Minh City (UEH). Its core objectives are to conduct applied research in road safety, urban mobility, rail systems, and low-carbon transition.",
      "about.body2":    "The System supports project-based education and develops fit-for-purpose technological solutions to generate robust, evidence-based insights that directly support decision-making and policymaking at city and national levels.",
      "about.body3":    "MOVE advances traffic safety, net-zero emissions, and smart city development in line with UEH's 2025–2030 Strategy, strengthening UEH's role as a leading University-City Innovation Hub in Asia.",

      "about.pillar.behaviors": "Behaviors",
      "about.pillar.ops":       "Operation Management",
      "about.pillar.env":       "Environment",
      "about.roles.title":      "Core Roles",
      "about.roles.list":       "Research · Raising Fund · Consultancy · Education Support (Undergraduate, Graduate, Non-Degree)",
      "about.tech.note":        "Applies VR, AR, AI, Machine Learning, Data Analysis & Interactive Simulation",

      "structure.eyebrow":  "STRUCTURE",
      "structure.title":    "Four integrated laboratories",
      "structure.sub":      "Each lab addresses a distinct dimension of the urban system — from human behavior on the road to carbon in the air — while sharing tooling, data, and people across MOVE.",

      "lab.see.short":      "Road safety for Vietnamese road users through VR, eye-tracking, machine learning and gamification.",
      "lab.smart.short":    "Intelligent transportation, MaaS, smart routing, and the Campus EV Micro-Mobility (CE-M) Program.",
      "lab.rail.short":     "Railway lab with rolling stock mock-ups, signalling simulators, PTC/CBTC and SCADA for smart rail capacity building.",
      "lab.ctr.short":      "Carbon Transition Lab — decarbonization, emission profiling, digital twins, and net-zero pathways.",

      "lab.see.name":       "SEE Living Lab",
      "lab.smart.name":     "Smart Mobility Lab",
      "lab.rail.name":      "CE-Rail@UEH",
      "lab.ctr.name":       "CtrLab",

      "people.eyebrow":     "PEOPLE",
      "people.title":       "The team behind MOVE",
      "people.sub":         "Faculty, researchers, and PhD candidates from ISCM and partner institutions worldwide.",

      "funding.eyebrow":    "FUNDING",
      "funding.title":      "Potential funds for 2026+",
      "funding.lead":       "A staged funding portfolio connecting international research calls, national programmes, and private innovation capital to MOVE's four labs.",
      "funding.intl":       "International joint research",
      "funding.intl.list":  "FWO (Belgium) · KOICA (Korea) · JICA (Japan) · DFG (Germany)",
      "funding.intl.desc":  "Bilateral and development-partner calls for applied research, pilots, and regional knowledge transfer.",
      "funding.national":   "National grants",
      "funding.national.list": "NAFOSTED · Ministry-level · Department-level · UEH grants",
      "funding.national.desc": "Competitive Vietnamese research grants for evidence generation, policy testing, and lab infrastructure.",
      "funding.private":    "Private",
      "funding.private.list": "VinIF and others",
      "funding.private.desc": "Innovation funding and industry sponsorship for productisation, demo deployments, and scale-up.",
      "funding.purpose":    "Research Implementation · Capacity Building · PhD Student · Postdoc",
      "funding.scale.global": "Global",
      "funding.scale.vn":   "Vietnam",
      "funding.scale.market": "Market",
      "funding.ministry":   "Ministry-level",
      "funding.department": "Department-level",
      "funding.corporate":  "Corporate CSR",
      "funding.industry":   "Industry partners",
      "funding.flow1":      "Research implementation",
      "funding.flow2":      "Capacity building",
      "funding.flow3":      "PhD student support",
      "funding.flow4":      "Postdoc recruitment",

      "tech.eyebrow":       "TECHNOLOGY & TOOLS",
      "tech.title":         "Technology & Tools",
      "tech.items":         "Digital Twin · Hologram · AR / VR · Agent-based Models · Machine Learning, AI · Big Data",

      "contact.visit":      "Visit the ISCM website",
      "contact.address":    "232/6 Vo Thi Sau, Xuan Hoa Ward, Ho Chi Minh City",
      "contact.phone":      "(+84) 283 930 9589",
      "contact.site":       "iscm.ueh.edu.vn",
      "contact.email":      "iscm@ueh.edu.vn",

      // Lab detail pages
      "see.back":           "Back to MOVE hub",
      "see.h1":             "SEE Living Lab",
      "see.lead":           "A pioneering platform designed to strengthen road safety for road users in Vietnam — through gamification, immersive VR, eye-tracking, and machine learning.",
      "see.sense":          "Sense",
      "see.engage":         "Engage",
      "see.evolve":         "Evolve",
      "see.extension":      "Extension",
      "see.p1.name":        "R2S Education",
      "see.p1.type":        "Virtual platform",
      "see.p1.body":        "Enhance traffic rules knowledge, situation-awareness skills, risk detection and risk management.",
      "see.p2.name":        "R2S VR Cycling",
      "see.p2.type":        "Hybrid platform",
      "see.p2.body":        "Improve hazard-perception skills and virtual cycling behavior in controlled, realistic environments.",
      "see.p3.name":        "R2S Map",
      "see.p3.type":        "Virtual platform",
      "see.p3.body":        "Improve traffic safety and mobility by mapping and visualizing safe routes for vulnerable road users.",
      "see.p4.name":        "Spatial Problem–Solution Mapping",
      "see.p4.type":        "Virtual platform",
      "see.p4.body":        "Support decision making and policy design through spatial problem-to-solution mapping.",
      "see.demo.title":     "Hazard-spotting challenge",
      "see.demo.sub":       "Click every hazard you can see before the 20-second timer runs out — inspired by the R2S Education gamified module.",

      "smart.back":         "Back to MOVE hub",
      "smart.h1":           "Smart Mobility Lab",
      "smart.lead":         "Advancing intelligent transportation systems and sustainable urban mobility — MaaS, smart routing, traffic operations, last-mile and micro-mobility.",
      "smart.t1":           "Mobility as a Service & Smart Routing",
      "smart.t1.body":      "Real-time transportation platform, integrated payments, transparency data from stakeholders, and demand modelling informed by urban structure.",
      "smart.t2":           "Smart Mobility & Traffic Operation",
      "smart.t2.body":      "Adaptive signal control, AI-based demand forecasting, and route optimization tailored to HCMC's mixed-traffic environment.",
      "smart.t3":           "Last-Mile & Micro-Mobility",
      "smart.t3.body":      "Micro-mobility hub/stop planning, data efficiency and small-vehicle safety.",
      "smart.cem.title":    "CE-M Program — Campus EV Micro-Mobility",
      "smart.cem.body":     "A real-world testbed for electric and shared mobility: e-motorbike + e-shuttle bus network, campus-first incentives, and partnerships with fleet suppliers and charging providers.",
      "smart.demo.title":   "MaaS Route Planner",
      "smart.demo.sub":     "Pick an origin and a destination on the campus map — the planner stitches walking, e-motorbike and e-shuttle legs into one optimized multimodal route.",

      "rail.back":          "Back to MOVE hub",
      "rail.h1":            "CE-Rail@UEH",
      "rail.lead":          "A dedicated railway laboratory building capacity in modern rail systems through small-scale simulation testbeds and a rail–city smart corridor living lab.",
      "rail.s1":            "Rail Systems Lab",
      "rail.s1.body":       "Rolling stock mock-up, signalling simulator, PTC/CBTC training modules, and a SCADA supervisory control sandbox for hands-on training and certification.",
      "rail.s2":            "Rail-City Smart Corridor Living Lab",
      "rail.s2.body":       "Transit-Oriented Development prototypes, passenger-flow experiments, and last-mile integration with e-mobility and micro-mobility solutions. Inspired by collaborative city-operator research programs such as Tokyo Metro.",
      "rail.demo.title":    "Rail-City Corridor explorer",
      "rail.demo.sub":      "Drag the slider to travel the corridor — see how TOD density, last-mile integration, and passenger flow evolve from station core to the urban edge.",

      "ctr.back":           "Back to MOVE hub",
      "ctr.h1":             "CtrLab — Carbon Transition Lab",
      "ctr.lead":            "Understand, quantify, and control carbon emissions and their impacts through data-driven science — integrating emissions, exposure, energy and climate into one unified system.",
      "ctr.track.air":      "Air Quality",
      "ctr.track.air.body": "PM2.5 spatial distribution in HCMC, interactions between urban morphology and air pollution, and resident exposure-risk maps using WRF-CMAQ modelling.",
      "ctr.track.climate":  "Climate Change Adaptation",
      "ctr.track.climate.body": "Integrated urban digital twin linking transportation, pollution emission, and urban heat — development of scenarios and a digital twin platform.",
      "ctr.track.energy":   "Energy Efficiency",
      "ctr.track.energy.body": "Long-term analysis of electricity consumption efficiency in Vietnam and the economic drivers of energy intensity turning points.",
      "ctr.demo.title":     "Exposure risk explorer",
      "ctr.demo.sub":       "Use the time slider to see PM2.5 concentration and exposure risk across HCMC, and toggle between air-quality, urban-heat and energy layers.",

      "common.publications":"Publications",
      "common.projects":    "Projects",
      "common.stakeholders":"Stakeholders & Benefits",
      "common.timeline":    "Timeline",
      "common.students":    "Students",
      "common.universities":"Universities & Institutions",
      "common.gov":         "Authorities & Government",
      "common.industry":    "Industry Partners",
    },

    vi: {
      "nav.about":      "Giới thiệu",
      "nav.structure":  "Cấu trúc",
      "nav.people":     "Nhân sự",
      "nav.funding":    "Tài trợ",
      "nav.tech":       "Công nghệ",
      "nav.labs":       "Phòng lab",

      "hero.eyebrow":   "VIỆN ĐÔ THỊ THÔNG MINH & QUẢN LÝ · UEH",
      "hero.title":     "Hệ thống <em>MOVE</em>",
      "hero.sub":       "Mobility-oriented, Operations, Visualization & Environment System — nền tảng nghiên cứu và đổi mới hàng đầu, hướng tới an toàn giao thông, vận tải trung hoà các-bon và phát triển đô thị thông minh tại Việt Nam.",
      "hero.hint":      "Xoay · Di chuột vào cột · Nhấn để vào lab",

      "about.eyebrow":  "GIỚI THIỆU",
      "about.title":    "Nền tảng nghiên cứu ứng dụng đô thị chủ lực",
      "about.body1":    "MOVE System được phát triển bởi Viện Đô thị Thông minh & Quản lý (ISCM) – Trường Đại học Kinh tế TP.HCM (UEH). Mục tiêu cốt lõi là tiến hành nghiên cứu ứng dụng về an toàn đường bộ, giao thông đô thị, hệ thống đường sắt và chuyển dịch carbon thấp.",
      "about.body2":    "Hệ thống hỗ trợ giáo dục theo dự án và phát triển các giải pháp công nghệ phù hợp để tạo ra các luận chứng khoa học vững chắc, trực tiếp phục vụ quá trình ra quyết định và hoạch định chính sách ở cấp thành phố và quốc gia.",
      "about.body3":    "MOVE thúc đẩy an toàn giao thông, phát thải ròng bằng 0 và phát triển đô thị thông minh, phù hợp với Chiến lược 2025–2030 của UEH, củng cố vai trò UEH như một trung tâm đổi mới sáng tạo Đại học – Đô thị hàng đầu châu Á.",

      "about.pillar.behaviors": "Hành vi",
      "about.pillar.ops":       "Quản lý vận hành",
      "about.pillar.env":       "Môi trường",
      "about.roles.title":      "Vai trò cốt lõi",
      "about.roles.list":       "Nghiên cứu · Huy động tài trợ · Tư vấn · Hỗ trợ giáo dục (Đại học, Sau đại học, Không cấp bằng)",
      "about.tech.note":        "Ứng dụng VR, AR, AI, Machine Learning, Phân tích dữ liệu & Mô phỏng tương tác",

      "structure.eyebrow":  "CẤU TRÚC",
      "structure.title":    "Bốn phòng thí nghiệm tích hợp",
      "structure.sub":      "Mỗi lab đảm nhiệm một chiều kích riêng của hệ thống đô thị — từ hành vi người đi đường đến khí các-bon trong không khí — đồng thời chia sẻ công cụ, dữ liệu và đội ngũ trong MOVE.",

      "lab.see.short":      "An toàn đường bộ cho người tham gia giao thông Việt Nam thông qua VR, eye-tracking, học máy và gamification.",
      "lab.smart.short":    "Giao thông thông minh, MaaS, định tuyến và Chương trình Vi-di chuyển điện trong khuôn viên (CE-M).",
      "lab.rail.short":     "Phòng thí nghiệm đường sắt với mô hình đoàn tàu, mô phỏng tín hiệu, PTC/CBTC và SCADA để xây dựng năng lực đường sắt thông minh.",
      "lab.ctr.short":      "Lab Chuyển dịch Các-bon — giảm phát thải, định lượng khí thải, digital twin và lộ trình net-zero.",

      "lab.see.name":       "SEE Living Lab",
      "lab.smart.name":     "Smart Mobility Lab",
      "lab.rail.name":      "CE-Rail@UEH",
      "lab.ctr.name":       "CtrLab",

      "people.eyebrow":     "NHÂN SỰ",
      "people.title":       "Đội ngũ đứng sau MOVE",
      "people.sub":         "Giảng viên, nghiên cứu viên và nghiên cứu sinh tiến sĩ từ ISCM và các đối tác quốc tế.",

      "funding.eyebrow":    "TÀI TRỢ",
      "funding.title":      "Nguồn quỹ tiềm năng cho 2026+",
      "funding.lead":       "Danh mục tài trợ theo giai đoạn, kết nối các lời gọi nghiên cứu quốc tế, chương trình trong nước và vốn đổi mới sáng tạo tư nhân cho bốn phòng lab của MOVE.",
      "funding.intl":       "Hợp tác nghiên cứu quốc tế",
      "funding.intl.list":  "FWO (Bỉ) · KOICA (Hàn) · JICA (Nhật) · DFG (Đức)",
      "funding.intl.desc":  "Các lời gọi song phương và đối tác phát triển cho nghiên cứu ứng dụng, thí điểm và chuyển giao tri thức khu vực.",
      "funding.national":   "Tài trợ quốc gia",
      "funding.national.list": "NAFOSTED · Cấp Bộ · Cấp Sở · Tài trợ UEH",
      "funding.national.desc": "Các quỹ nghiên cứu cạnh tranh tại Việt Nam cho tạo lập bằng chứng, thử nghiệm chính sách và hạ tầng phòng lab.",
      "funding.private":    "Tư nhân",
      "funding.private.list": "VinIF và các quỹ khác",
      "funding.private.desc": "Tài trợ đổi mới sáng tạo và đồng hành doanh nghiệp cho phát triển sản phẩm, triển khai demo và mở rộng quy mô.",
      "funding.purpose":    "Triển khai nghiên cứu · Xây dựng năng lực · Nghiên cứu sinh · Postdoc",
      "funding.scale.global": "Quốc tế",
      "funding.scale.vn":   "Việt Nam",
      "funding.scale.market": "Thị trường",
      "funding.ministry":   "Cấp Bộ",
      "funding.department": "Cấp Sở",
      "funding.corporate":  "CSR doanh nghiệp",
      "funding.industry":   "Đối tác ngành",
      "funding.flow1":      "Triển khai nghiên cứu",
      "funding.flow2":      "Xây dựng năng lực",
      "funding.flow3":      "Hỗ trợ nghiên cứu sinh",
      "funding.flow4":      "Tuyển dụng postdoc",

      "tech.eyebrow":       "CÔNG NGHỆ & CÔNG CỤ",
      "tech.title":         "Công nghệ & Công cụ",
      "tech.items":         "Digital Twin · Hologram · AR / VR · Mô hình dựa trên tác tử · Học máy, AI · Dữ liệu lớn",

      "contact.visit":      "Truy cập website ISCM",
      "contact.address":    "232/6 Võ Thị Sáu, P. Xuân Hoà, TP. Hồ Chí Minh",
      "contact.phone":      "(+84) 283 930 9589",
      "contact.site":       "iscm.ueh.edu.vn",
      "contact.email":      "iscm@ueh.edu.vn",

      "see.back":           "Về trung tâm MOVE",
      "see.h1":             "SEE Living Lab",
      "see.lead":           "Nền tảng tiên phong nhằm tăng cường an toàn giao thông cho người tham gia giao thông tại Việt Nam — thông qua gamification, VR, eye-tracking và học máy.",
      "see.sense":          "Sense",
      "see.engage":         "Engage",
      "see.evolve":         "Evolve",
      "see.extension":      "Extension",
      "see.p1.name":        "R2S Education",
      "see.p1.type":        "Nền tảng ảo",
      "see.p1.body":        "Nâng cao kiến thức luật giao thông, kỹ năng nhận thức tình huống, phát hiện và quản lý rủi ro.",
      "see.p2.name":        "R2S VR Cycling",
      "see.p2.type":        "Nền tảng lai",
      "see.p2.body":        "Cải thiện kỹ năng nhận diện nguy hiểm và hành vi đi xe đạp trong môi trường ảo thực tế.",
      "see.p3.name":        "R2S Map",
      "see.p3.type":        "Nền tảng ảo",
      "see.p3.body":        "Tăng cường an toàn và di chuyển bằng cách lập bản đồ và trực quan hoá các tuyến đường an toàn.",
      "see.p4.name":        "Spatial Problem–Solution Mapping",
      "see.p4.type":        "Nền tảng ảo",
      "see.p4.body":        "Hỗ trợ ra quyết định và thiết kế chính sách thông qua bản đồ không gian vấn đề – giải pháp.",
      "see.demo.title":     "Thử thách phát hiện nguy hiểm",
      "see.demo.sub":       "Nhấn vào mọi mối nguy bạn thấy trước khi hết 20 giây — lấy cảm hứng từ mô-đun R2S Education.",

      "smart.back":         "Về trung tâm MOVE",
      "smart.h1":           "Smart Mobility Lab",
      "smart.lead":         "Phát triển hệ thống giao thông thông minh và di chuyển đô thị bền vững — MaaS, định tuyến, vận hành giao thông, và vi-di chuyển chặng cuối.",
      "smart.t1":           "MaaS & Định tuyến thông minh",
      "smart.t1.body":      "Nền tảng vận tải thời gian thực, thanh toán tích hợp, dữ liệu minh bạch từ các bên liên quan, và mô hình hoá nhu cầu dựa trên cấu trúc đô thị.",
      "smart.t2":           "Giao thông thông minh & Vận hành",
      "smart.t2.body":      "Điều khiển tín hiệu thích ứng, dự báo nhu cầu bằng AI, và tối ưu lộ trình phù hợp với môi trường giao thông hỗn hợp của TP.HCM.",
      "smart.t3":           "Chặng cuối & Vi-di chuyển",
      "smart.t3.body":      "Quy hoạch trạm/điểm vi-di chuyển, hiệu quả dữ liệu và an toàn phương tiện nhỏ.",
      "smart.cem.title":    "Chương trình CE-M — Vi-di chuyển điện trong khuôn viên",
      "smart.cem.body":     "Môi trường thử nghiệm thực tế cho di chuyển điện và chia sẻ: mạng lưới e-motorbike + e-shuttle, ưu đãi cho người dùng khuôn viên, hợp tác với nhà cung cấp phương tiện và trạm sạc.",
      "smart.demo.title":   "Trình lập tuyến MaaS",
      "smart.demo.sub":     "Chọn điểm đi và điểm đến trên bản đồ khuôn viên — trình lập tuyến kết nối đi bộ, e-motorbike và e-shuttle thành một lộ trình đa phương thức tối ưu.",

      "rail.back":          "Về trung tâm MOVE",
      "rail.h1":            "CE-Rail@UEH",
      "rail.lead":          "Phòng thí nghiệm đường sắt chuyên biệt xây dựng năng lực hệ thống đường sắt hiện đại qua mô phỏng quy mô nhỏ và hành lang đô thị – đường sắt thông minh.",
      "rail.s1":            "Rail Systems Lab",
      "rail.s1.body":       "Mô hình đoàn tàu, mô phỏng tín hiệu, các mô-đun đào tạo PTC/CBTC, và sandbox điều khiển giám sát SCADA cho đào tạo thực hành và chứng chỉ.",
      "rail.s2":            "Rail-City Smart Corridor Living Lab",
      "rail.s2.body":       "Nguyên mẫu TOD, thí nghiệm luồng hành khách, và tích hợp chặng cuối với e-mobility và vi-di chuyển. Lấy cảm hứng từ các chương trình nghiên cứu hợp tác thành phố–vận hành như Tokyo Metro.",
      "rail.demo.title":    "Khám phá hành lang Rail-City",
      "rail.demo.sub":      "Kéo thanh trượt để đi dọc hành lang — xem mật độ TOD, tích hợp chặng cuối và luồng hành khách biến đổi từ ga trung tâm ra rìa đô thị.",

      "ctr.back":           "Về trung tâm MOVE",
      "ctr.h1":             "CtrLab — Lab Chuyển dịch Các-bon",
      "ctr.lead":           "Hiểu, định lượng và kiểm soát phát thải các-bon cùng tác động của nó qua khoa học dữ liệu — tích hợp phát thải, phơi nhiễm, năng lượng và khí hậu trong một hệ thống thống nhất.",
      "ctr.track.air":      "Chất lượng không khí",
      "ctr.track.air.body": "Phân bố không gian PM2.5 tại TP.HCM, tương tác giữa hình thái đô thị và ô nhiễm không khí, và bản đồ rủi ro phơi nhiễm cư dân dùng mô hình WRF-CMAQ.",
      "ctr.track.climate":  "Thích ứng biến đổi khí hậu",
      "ctr.track.climate.body": "Digital twin đô thị tích hợp kết nối giao thông, phát thải và nhiệt đô thị — phát triển kịch bản và nền tảng digital twin.",
      "ctr.track.energy":   "Hiệu quả năng lượng",
      "ctr.track.energy.body": "Phân tích dài hạn hiệu quả tiêu thụ điện tại Việt Nam và các yếu tố kinh tế tác động đến điểm bước ngoặt cường độ năng lượng.",
      "ctr.demo.title":     "Bản đồ phơi nhiễm tương tác",
      "ctr.demo.sub":       "Dùng thanh trượt thời gian để xem PM2.5 và rủi ro phơi nhiễm khắp TP.HCM, và chuyển giữa các lớp không khí, nhiệt đô thị và năng lượng.",

      "common.publications":"Công bố khoa học",
      "common.projects":    "Dự án",
      "common.stakeholders":"Các bên liên quan & Lợi ích",
      "common.timeline":    "Tiến độ",
      "common.students":    "Sinh viên",
      "common.universities":"Đại học & Viện",
      "common.gov":         "Cơ quan & Chính phủ",
      "common.industry":    "Đối tác công nghiệp",
    }
  };

  const KEY = "move.lang";
  let lang = (typeof localStorage !== "undefined" && localStorage.getItem(KEY)) || "en";

  function t(k){
    return (DICT[lang] && DICT[lang][k]) || (DICT.en[k]);
  }

  function apply(root){
    root = root || document;
    root.documentElement.lang = lang;
    root.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      const v = t(k);
      if (typeof v === "undefined") return;
      // allow simple <em> in translations
      if (v.indexOf("<") !== -1) el.innerHTML = v;
      else el.textContent = v;
    });
    root.querySelectorAll("[data-i18n-attr]").forEach(el => {
      const pairs = el.getAttribute("data-i18n-attr").split(";");
      pairs.forEach(p => {
        const [attr,key] = p.split(":").map(s => s.trim());
        const v = key && t(key);
        if (attr && typeof v !== "undefined") el.setAttribute(attr, v);
      });
    });
    // active state on lang toggles
    root.querySelectorAll(".lang-toggle button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
    // fire event so 3D scene or demos can relabel
    document.dispatchEvent(new CustomEvent("i18n:change",{detail:{lang}}));
  }

  function setLang(l){
    if (!DICT[l]) return;
    lang = l;
    try{ localStorage.setItem(KEY, l); }catch(e){}
    apply();
  }

  function getLang(){ return lang; }

  w.I18N = { t, apply, setLang, getLang, DICT };
})(window);
