```
Global-Edu-Assist
├─ g-e-a
│  ├─ Backend
│  │  ├─ .env
│  │  ├─ config
│  │  │  ├─ db.js
│  │  │  └─ multerConfig.js
│  │  ├─ controllers
│  │  │  ├─ agentAuthController.js
│  │  │  ├─ agentController.js
│  │  │  ├─ authController.js
│  │  │  ├─ chatController.js
│  │  │  ├─ documentController.js
│  │  │  ├─ institutionController.js
│  │  │  ├─ postController.js
│  │  │  ├─ progressController.js
│  │  │  ├─ superAdminController.js
│  │  │  └─ userController.js
│  │  ├─ index.js
│  │  ├─ middleware
│  │  │  └─ authMiddleware.js
│  │  ├─ Models
│  │  │  ├─ admin.js
│  │  │  ├─ agent.js
│  │  │  ├─ agents.js
│  │  │  ├─ chat.js
│  │  │  ├─ documents.js
│  │  │  ├─ institutions.js
│  │  │  ├─ like.js
│  │  │  ├─ post.js
│  │  │  ├─ progressTracking.js
│  │  │  └─ user.js
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  ├─ routes
│  │  │  ├─ adminRoutes.js
│  │  │  ├─ agentRoutes.js
│  │  │  ├─ authRoutes.js
│  │  │  ├─ chatRoutes.js
│  │  │  ├─ documentRoutes.js
│  │  │  ├─ institutionRoutes.js
│  │  │  ├─ postRoutes.js
│  │  │  ├─ progressRoutes.js
│  │  │  └─ userRoutes.js
│  │  ├─ services
│  │  │  └─ emailService.js
│  │  └─ uploads
│  │     ├─ bannerImages-1742676450012-963167979.jpg
│  │     ├─ bannerImages-1742676450048-751793157.jpg
│  │     ├─ bannerImages-1742676450050-280221277.jpg
│  │     ├─ bannerImages-1742676450052-876479912.jpg
│  │     ├─ bannerImages-1742676450054-296399346.jpg
│  │     ├─ bannerImages-1742706374073-646699643.jpg
│  │     ├─ bannerImages-1744135305640-370312241.jpg
│  │     ├─ bannerImages-1744268584733-360105012.jpg
│  │     ├─ bannerImages-1744268584734-570832200.JPG
│  │     ├─ bannerImages-1744268584811-591249150.jpg
│  │     ├─ bannerImages-1744268585046-277678044.jpg
│  │     ├─ bannerImages-1744270498692-321942625.jpeg
│  │     ├─ bannerImages-1744270498748-950550891.jpg
│  │     ├─ bannerImages-1744270498802-124492496.jpg
│  │     ├─ bannerImages-1744270498911-232421380.jpg
│  │     ├─ bannerImages-1744270498926-306816151.JPG
│  │     ├─ bannerImages-1744270821865-539616179.jpg
│  │     ├─ bannerImages-1744270821867-672730264.jpg
│  │     ├─ bannerImages-1744270821969-688514779.jpeg
│  │     ├─ bannerImages-1744271203486-775833854.jpg
│  │     ├─ bannerImages-1744271203500-121611444.jpg
│  │     ├─ bannerImages-1744271203597-676884110.jpeg
│  │     ├─ bannerImages-1744271203598-886036553.jpg
│  │     ├─ bannerImages-1744271466764-532852683.jpg
│  │     ├─ bannerImages-1744271466899-984843772.jpg
│  │     ├─ bannerImages-1744271466901-476781137.jpg
│  │     ├─ bannerImages-1744271466905-153894976.jpg
│  │     ├─ bannerImages-1744272197528-492205059.jpg
│  │     ├─ bannerImages-1744272197552-720615606.jpg
│  │     ├─ bannerImages-1744272197573-493465629.jpg
│  │     ├─ bannerImages-1744272197588-68401318.jpg
│  │     ├─ bannerImages-1744272598276-13811108.jpeg
│  │     ├─ bannerImages-1744272598278-790926716.jpeg
│  │     ├─ bannerImages-1744272598385-309739533.jpg
│  │     ├─ bannerImages-1744272799324-994280770.jpg
│  │     ├─ bannerImages-1744272799326-740606955.jpg
│  │     ├─ bannerImages-1747416070638-570403941.png
│  │     ├─ bannerImages-1747416070651-809664865.png
│  │     ├─ bannerImages-1747416070653-734239805.png
│  │     ├─ bannerImages-1747416070654-25499993.png
│  │     ├─ bannerImages-1747416070654-852399278.png
│  │     ├─ bannerImages-1747491703344-15386216.png
│  │     ├─ bannerImages-1747491703353-88877359.png
│  │     ├─ bannerImages-1747491703366-967416392.png
│  │     ├─ bannerImages-1747491703368-288749773.png
│  │     ├─ bannerImages-1747491703369-781387146.png
│  │     ├─ companyRegistration-1745163448546-659346024.jpg
│  │     ├─ companyRegistration-1745163682510-370210885.jpg
│  │     ├─ companyRegistration-1745173040252-456347049.jpg
│  │     ├─ companyRegistration-1745242199148-267015192.jpg
│  │     ├─ companyRegistration-1745244789873-993163834.jpg
│  │     ├─ companyRegistration-1745486963988-719183061.jpg
│  │     ├─ companyRegistration-1745587138305-58780560.jpg
│  │     ├─ companyRegistration-1745587389755-175439615.png
│  │     ├─ companyRegistration-1745730371925-164579377.jpg
│  │     ├─ companyRegistration-1745769225265-647345605.jpg
│  │     ├─ companyRegistration-1746337762552-984557718.jpg
│  │     ├─ companyRegistration-1747464875957-532258715.jpg
│  │     ├─ document-1747464307680-785299100.png
│  │     ├─ document-1747464307727-298971248.png
│  │     ├─ document-1747464307756-835688509.png
│  │     ├─ document-1747464307793-231633858.png
│  │     ├─ document-1747489894805-187237019.png
│  │     ├─ document-1747489894944-273783126.png
│  │     ├─ document-1747489894987-901121802.png
│  │     ├─ document-1747489895025-465513091.png
│  │     ├─ documents-1745160993640-367605320.jpg
│  │     ├─ documents-1745161742924-977443384.jpg
│  │     ├─ documents-1745161742930-155676003.jpg
│  │     ├─ documents-1745161742931-256501747.jpg
│  │     ├─ documents-1745161742932-116123267.jpg
│  │     ├─ documents-1745161742932-797070940.jpg
│  │     ├─ documents-1745162229513-697363809.jpg
│  │     ├─ documents-1745162229517-183256695.jpg
│  │     ├─ documents-1745162315408-543112232.jpg
│  │     ├─ documents-1745162315409-577600581.jpg
│  │     ├─ documents-1745162315414-262397451.jpg
│  │     ├─ documents-1745162315414-85442619.jpg
│  │     ├─ documents-1745162315418-680985775.jpg
│  │     ├─ icanRegistration-1745163448546-479236214.jpg
│  │     ├─ icanRegistration-1745163682527-501875136.jpg
│  │     ├─ icanRegistration-1745173040252-466224360.jpg
│  │     ├─ icanRegistration-1745242199149-813817021.jpg
│  │     ├─ icanRegistration-1745244789875-264515200.jpg
│  │     ├─ icanRegistration-1745486963993-415618981.jpg
│  │     ├─ icanRegistration-1745587138307-840558318.jpg
│  │     ├─ icanRegistration-1745587389755-211382211.png
│  │     ├─ icanRegistration-1745730371929-53106229.jpg
│  │     ├─ icanRegistration-1745769225287-911350897.jpg
│  │     ├─ icanRegistration-1746337762555-126176765.jpg
│  │     ├─ icanRegistration-1747464875959-909847928.jpg
│  │     ├─ image-1744738842939-952413425.jpg
│  │     ├─ image-1744738871692-26187215.jpg
│  │     ├─ image-1744741387903-809239249.jpg
│  │     ├─ image-1744741393688-867068542.jpg
│  │     ├─ image-1744741421937-281311316.jpg
│  │     ├─ image-1744741425628-973522475.jpg
│  │     ├─ image-1744741428581-484935379.jpg
│  │     ├─ image-1744741549562-342731693.jpg
│  │     ├─ image-1744742791662-747171591.jpg
│  │     ├─ image-1744742795520-210869296.jpg
│  │     ├─ image-1744742803523-791679293.jpg
│  │     ├─ image-1744742810463-304196202.jpg
│  │     ├─ image-1744742819396-696652318.jpg
│  │     ├─ image-1744746390230-396130157.jpg
│  │     ├─ image-1744788424565-295302393.png
│  │     ├─ image-1744824409685-195566779.jpg
│  │     ├─ image-1744824452174-875245887.png
│  │     ├─ image-1744824466784-431425778.jpg
│  │     ├─ image-1744824474770-813061400.jpg
│  │     ├─ image-1744824480616-471055958.jpg
│  │     ├─ image-1744824483329-311125148.jpg
│  │     ├─ image-1744981000394-29415674.jpg
│  │     ├─ image-1745848482365-782469547.png
│  │     ├─ image-1745861609711-256641471.jpg
│  │     ├─ image-1745861617465-385350552.jpg
│  │     ├─ image-1745861621531-784696450.jpg
│  │     ├─ image-1745861666885-751459290.jpg
│  │     ├─ image-1745861848007-924505146.jpg
│  │     ├─ image-1746337616789-143351596.png
│  │     ├─ image-1747417164754-627405004.png
│  │     ├─ image-1747471719944-474167777.jpg
│  │     ├─ image-1747488840436-652232176.jpg
│  │     ├─ ownerCitizenship-1745163448548-230412234.jpg
│  │     ├─ ownerCitizenship-1745163682529-189786307.jpg
│  │     ├─ ownerCitizenship-1745173040253-99521053.jpg
│  │     ├─ ownerCitizenship-1745242199151-15615415.jpg
│  │     ├─ ownerCitizenship-1745244789880-639868035.jpg
│  │     ├─ ownerCitizenship-1745486963997-203507054.jpg
│  │     ├─ ownerCitizenship-1745587138308-884618906.jpg
│  │     ├─ ownerCitizenship-1745587390022-590119666.jpg
│  │     ├─ ownerCitizenship-1745730371932-526409582.jpg
│  │     ├─ ownerCitizenship-1745769225288-348157654.jpg
│  │     ├─ ownerCitizenship-1746337762555-236300692.jpg
│  │     ├─ ownerCitizenship-1747464875960-934607334.jpg
│  │     ├─ panVat-1745163448544-434376481.jpg
│  │     ├─ panVat-1745163682509-99609446.jpg
│  │     ├─ panVat-1745173040200-400357297.jpg
│  │     ├─ panVat-1745242199144-424371141.jpg
│  │     ├─ panVat-1745244789870-934565245.jpg
│  │     ├─ panVat-1745486963986-402166080.jpg
│  │     ├─ panVat-1745587138303-888267332.jpg
│  │     ├─ panVat-1745587389745-602161101.png
│  │     ├─ panVat-1745730371924-443112442.jpg
│  │     ├─ panVat-1745769225265-126530993.jpg
│  │     ├─ panVat-1746337762551-717657614.jpg
│  │     ├─ panVat-1747464875956-983873617.jpg
│  │     ├─ profilePicture-1742676450011-125852060.png
│  │     ├─ profilePicture-1742706374072-101456281.jpg
│  │     ├─ profilePicture-1744135305614-202298541.jpg
│  │     ├─ profilePicture-1744268584701-253570702.jpg
│  │     ├─ profilePicture-1744270498590-436607212.jpg
│  │     ├─ profilePicture-1744270821864-361105938.png
│  │     ├─ profilePicture-1744271203486-397368011.jpg
│  │     ├─ profilePicture-1744271466764-172388004.jpg
│  │     ├─ profilePicture-1744272197484-76435484.jpg
│  │     ├─ profilePicture-1744272598275-897083824.png
│  │     ├─ profilePicture-1744272799322-182718595.png
│  │     ├─ profilePicture-1745160993625-829909625.jpg
│  │     ├─ profilePicture-1745161742923-168037395.jpg
│  │     ├─ profilePicture-1745162229511-58823212.jpg
│  │     ├─ profilePicture-1745162315407-753980147.png
│  │     ├─ profilePicture-1745163448544-572788322.jpg
│  │     ├─ profilePicture-1745163682508-730334637.jpg
│  │     ├─ profilePicture-1745173040173-575670610.jpg
│  │     ├─ profilePicture-1745244789869-28763158.jpg
│  │     ├─ profilePicture-1745486963981-89586361.jpg
│  │     ├─ profilePicture-1745492513798-730900708.jpg
│  │     ├─ profilePicture-1745587138302-969712257.jpg
│  │     ├─ profilePicture-1745587389706-617857947.png
│  │     ├─ profilePicture-1745730371923-730306903.jpg
│  │     ├─ profilePicture-1745769225264-1307739.jpg
│  │     ├─ profilePicture-1745861068080-849550948.jpg
│  │     ├─ profilePicture-1746337762544-953691701.png
│  │     ├─ profilePicture-1747408719502-47040751.png
│  │     ├─ profilePicture-1747408736866-385548239.png
│  │     ├─ profilePicture-1747410745683-769695132.png
│  │     ├─ profilePicture-1747414190433-115293443.png
│  │     ├─ profilePicture-1747416070637-455247964.png
│  │     ├─ profilePicture-1747464307646-120436563.png
│  │     ├─ profilePicture-1747464703642-161065548.jpg
│  │     ├─ profilePicture-1747464875956-771691591.jpg
│  │     ├─ profilePicture-1747490172380-813913225.png
│  │     ├─ profilePicture-1747491703302-281098993.png
│  │     └─ Study_Abroad_Cost_Estimation.txt
│  └─ Frontend
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ project_structure.text
│     ├─ public
│     │  ├─ index.html
│     │  └─ Logo.png
│     ├─ README.md
│     └─ src
│        ├─ App.css
│        ├─ App.js
│        ├─ App.test.js
│        ├─ components
│        │  ├─ AccountMenu.js
│        │  ├─ Admin
│        │  │  ├─ AddInstitutions.js
│        │  │  ├─ DocumentForm.js
│        │  │  ├─ OverviewChart.js
│        │  │  ├─ PageHeader.js
│        │  │  ├─ Sidebar.js
│        │  │  ├─ StatCard.js
│        │  │  └─ SuperAdminMenu.js
│        │  ├─ Agents
│        │  │  ├─ PostSystem.js
│        │  │  └─ ProfileMenu.js
│        │  ├─ AllDocumentsChecklist.js
│        │  ├─ Calculation.js
│        │  ├─ ChatSystem.js
│        │  ├─ Estimation.js
│        │  ├─ Footer.css
│        │  ├─ Footer.js
│        │  ├─ Loading.js
│        │  ├─ NavBar.css
│        │  ├─ NavBar.js
│        │  ├─ ProctectedRoute
│        │  │  ├─ AuthRoute.js
│        │  │  └─ ProtectedRoute.js
│        │  ├─ ProgramCard.js
│        │  ├─ ProgressTracking.js
│        │  ├─ Report.js
│        │  ├─ SearchBar.js
│        │  ├─ stages
│        │  │  ├─ COEStage.js
│        │  │  ├─ GSStage.js
│        │  │  ├─ OfferStage.js
│        │  │  └─ VisaStage.js
│        │  ├─ TabPanel.js
│        │  └─ verify.js
│        ├─ Context
│        │  ├─ AuthContext.js
│        │  └─ context.js
│        ├─ images
│        │  ├─ BestFit.png
│        │  ├─ documentBG.jpg
│        │  ├─ financial.jpg
│        │  ├─ Financial.png
│        │  ├─ ham.png
│        │  ├─ Institutions
│        │  │  └─ ACU
│        │  │     ├─ ACU.png
│        │  │     ├─ Ballarat.jpg
│        │  │     ├─ Blacktown.jpg
│        │  │     ├─ Brisbane.jpg
│        │  │     ├─ Canberra.jpg
│        │  │     ├─ Melbourne.jpg
│        │  │     ├─ North Sydney.jpg
│        │  │     └─ Strathfield.jpg
│        │  ├─ LandingPageBG.png
│        │  ├─ Logo.png
│        │  ├─ offerLette.png
│        │  ├─ offerLetter.jpg
│        │  └─ thingsToConsider.png
│        ├─ index.css
│        ├─ index.js
│        ├─ layouts
│        │  └─ Admin
│        │     └─ DashboardLayout.js
│        ├─ Pages
│        │  ├─ About
│        │  │  └─ About.js
│        │  ├─ Admin
│        │  │  ├─ Agents.js
│        │  │  ├─ Dashboard.js
│        │  │  ├─ Documents.js
│        │  │  ├─ ForgotPassword.js
│        │  │  ├─ InstitutionPage.js
│        │  │  ├─ Institutions.js
│        │  │  ├─ Login.js
│        │  │  └─ ManageAdmins.js
│        │  ├─ Agents
│        │  │  ├─ Agents.js
│        │  │  ├─ Dashboard
│        │  │  │  └─ Dashboard.js
│        │  │  ├─ Login
│        │  │  │  ├─ ForgotPassword.js
│        │  │  │  └─ Login.js
│        │  │  ├─ Registration
│        │  │  │  └─ Registration.js
│        │  │  └─ Resubmit.js
│        │  ├─ Documents
│        │  │  ├─ Documents.css
│        │  │  └─ Documents.js
│        │  ├─ Institutions
│        │  │  ├─ InstitutionPage.js
│        │  │  ├─ institutions.css
│        │  │  └─ Institutions.js
│        │  ├─ LandingPage
│        │  │  ├─ LandingPage.css
│        │  │  └─ LandingPage.js
│        │  ├─ Login
│        │  │  ├─ ForgotPassword.js
│        │  │  └─ Login.js
│        │  ├─ profile.js
│        │  ├─ Programs
│        │  │  └─ Programs.js
│        │  └─ Signup
│        │     └─ Signup.js
│        ├─ reportWebVitals.js
│        ├─ setupTests.js
│        └─ utils
│           ├─ authService.js
│           ├─ axiosConfig.js
│           ├─ parseJwt.js
│           └─ utils.js
└─ project_structure.text
```
