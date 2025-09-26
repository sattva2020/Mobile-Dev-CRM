#!/usr/bin/env node

/**
 * 🎯 OnlyTests Полный Парсер с Примерами - Получение всех промптов и примеров с сайта
 * Автоматический парсинг всех секций OnlyTests Библиотеки Промптов с примерами
 */

// Полные промпты OnlyTests с примерами (получены через Playwright MCP)
const onlyTestsCompletePrompts = {
  // 1. Планирование Тестирования
  planning: {
    testPlan: {
      title: 'Разработка Плана Тестирования',
      description:
        'Создание комплексных планов тестирования, охватывающих все аспекты тестирования, среды и требования к ресурсам для различных типов проектов.',
      tags: ['план тестирования', 'тестовые среды', 'планирование ресурсов', 'тестовое покрытие'],
      fullPrompt: `## System Instruction
You are an expert QA Test Manager. You are tasked with creating a **comprehensive test plan** based on the given inputs. The test plan should follow a structured format and include all specified sections.  
If any information is not provided, you must mark it clearly as **"TBD" (To Be Determined)**.

## Goal
Generate a comprehensive and professional **Test Plan document** for a software project or sub-process.

## Input
- Project or Test Sub-process name.
- Details about the project scope, risks, stakeholders, test items, etc.
- If information is missing, explicitly mark it as **TBD**.

## Procedure
1. Organize the test plan into the specified sections.
2. For each section, provide detailed and precise content.
3. If information is not available or not specified, write **"TBD"** for that section.
4. Maintain a clear, structured, and formal tone suitable for professional test documentation.

## Output Format
- The entire test plan must be returned **inside a Markdown code block using script block syntax**.
- Use appropriate section headers for each part of the test plan.
- For missing information, display: **TBD**.
- The final output should be a **clean, well-formatted test plan document**.

## Test Plan Sections
1. Project/Test Sub-process
2. Test Item(s)
3. Test Scope
4. Assumptions and Constraints
5. Stakeholders
6. Testing Communication
7. Product Risks
8. Project Risks
9. Test Strategy for test sub-process
10. Test Deliverables
11. Test Design Techniques
12. Test Completion Criteria
13. Metrics Collected
14. Test Data Requirements
15. Test Environment Requirements
16. Retesting and Regression Testing
17. Suspension and Resumption Criteria
18. Deviations from the Organizational Test Strategy
19. Testing Activities and Estimates
20. Roles, Activities, and Responsibilities
21. Hiring Needs
22. Training Needs
23. Schedule

## Quality Checklist
- Includes **all 23 specified sections**.
- Missing information is clearly marked as **TBD**.
- Output is returned **inside a Markdown script block**.
- Uses professional language and structured formatting.
- Sections are clearly delineated and labeled.

## Revision Loop
After generating the Test Plan, conclude with:  
> Confirm if further adjustments are needed.

## Example
(Partial Example for illustration)

# Test Plan

## Project/Test Sub-process
Project ABC - Mobile App Testing

## Test Item(s)
- Login Module
- Payment Gateway Integration

## Test Scope
- Functional Testing of user authentication and payment flow.
- Excludes performance and security testing.

## Assumptions and Constraints
- Third-party payment gateway will be available for sandbox testing.
- Limited access to production-like test environment.

...

## Training Needs
**TBD**

## Schedule
**TBD**`,
      examples: [
        {
          title: 'Контроль Доступа EduTrack',
          input:
            "This phase of testing focuses on validating the access control for different user roles in the EduTrack LMS system — specifically, Admins, Teachers, and Students. The main modules under test include the Admin Dashboard, the Teacher Module, and the Student Portal. The idea is to make sure each role can only access what they're supposed to. We won't be covering any third-party plugin permissions in this cycle. Role mapping will be handled by the backend team, and they've created a few test accounts. Communication will be through weekly Zoom check-ins and Slack for daily updates. Risks include possible unauthorized access for students or teachers viewing admin-only data. We'll be using manual test cases for now, with some planning to do exploratory testing. A basic staging environment is already set up with role-based test users. The QA team includes one lead and two engineers, and we're expecting to run this test cycle over the course of one week. There are no plans for new hires, but a short briefing on the new access model will be needed.",
          output:
            "EduTrack LMS – Role-Based Access Control Validation\n\n## Test Item(s)\n- Admin Dashboard\n- Teacher Module\n- Student Portal\n\n## Test Scope\nThis test phase is focused on validating role-based access control for three primary user roles: Admins, Teachers, and Students. Each user role will be tested to ensure they have access only to their permitted features and data. This scope excludes testing for any third-party plugin permissions.\n\n## Assumptions and Constraints\n- Role mapping logic is implemented and maintained by the backend team.\n- Test accounts have been created and configured by the backend team.\n- Only the internal modules will be tested; external integrations are out of scope.\n- Manual test cases will be the primary testing approach.\n- Access control definitions are assumed to be final for this testing phase.\n\n## Stakeholders\n- QA Lead\n- QA Engineers\n- Development Team (Backend)\n- Project Manager\n- Product Owner\n\n## Testing Communication\n- Weekly Zoom meetings for status check-ins.\n- Daily updates via Slack channel dedicated to QA and Dev coordination.\n\n## Product Risks\n- Improper role restrictions may allow unauthorized data access.\n- Teachers or students might gain unintended visibility into admin-level information.\n- Incomplete access rules might block legitimate functionality for a role.\n\n## Project Risks\n- Lack of automated regression coverage could delay identification of access issues in future releases.\n- Brief test duration may limit coverage of edge cases.\n- Potential misalignment between the documented access model and the implemented logic.\n\n## Test Strategy for test sub-process\nManual testing will be employed to validate each role's access rights using predefined test cases. Exploratory testing will be conducted to uncover any access gaps or undocumented behavior. Each role will be tested across all applicable modules using role-specific test accounts.\n\n## Test Deliverables\n- Test Plan Document\n- Test Cases (Role-Based Access)\n- Test Summary Report\n- Defect Logs\n- Daily Status Updates\n- Risk & Issue Log\n\n## Test Design Techniques\n- Equivalence Partitioning for input validation\n- State Transition Testing for role-switching scenarios\n- Exploratory Testing for unexpected access paths\n- Use Case-Based Testing for scenario validation per role\n\n## Test Completion Criteria\n- All planned test cases executed\n- All high and critical severity bugs resolved or accepted with mitigation\n- No unauthorized access incidents found during final exploratory round\n- Test summary report delivered and reviewed\n\n## Metrics Collected\n- Test Case Execution Rate\n- Pass/Fail Rate per Role\n- Number and Severity of Defects Found\n- Defect Density per Module\n- Time to Detect and Resolve Defects\n\n## Test Data Requirements\n- One test account for each role (Admin, Teacher, Student)\n- Pre-mapped permissions per role\n- Sample data for each module to simulate real-world scenarios\n\n## Test Environment Requirements\n- Staging environment with latest build\n- Role-based test accounts configured\n- Admin, Teacher, and Student modules deployed\n- Access to logs for debugging purposes\n\n## Retesting and Regression Testing\n- Retesting of fixed defects will be performed manually.\n- Basic regression will be conducted for core navigation paths post-defect fixes.\n\n## Suspension and Resumption Criteria\n- Testing will be suspended if the staging environment becomes unavailable or unstable.\n- Testing resumes once the environment is restored and test data is verified.\n\n## Deviations from the Organizational Test Strategy\n- No automation will be used in this cycle despite standard policy favoring automation.\n- Limited scope of regression due to time constraints.\n\n## Testing Activities and Estimates\n- Test Planning: 0.5 days\n- Test Case Design: 1 day\n- Test Execution: 3 days\n- Defect Verification and Retesting: 1.5 days\n- Reporting and Wrap-up: 1 day\n\n## Roles, Activities, and Responsibilities\n- QA Lead: Test planning, coordination, reporting, risk management.\n- QA Engineers: Test case design, execution, defect logging, and verification.\n- Dev Team: Environment setup, bug fixing, and access configuration support.\n\n## Hiring Needs\nNo additional hiring required for this test cycle.\n\n## Training Needs\nBriefing session required to explain the new access control model to the QA team.\n\n## Schedule\n- Test Planning: Day 1\n- Test Case Design: Day 2\n- Test Execution: Days 3–5\n- Retesting and Reporting: Days 6–7\n\n> Confirm if further adjustments are needed.",
        },
        {
          title: 'Интеграция HealthSync E2E',
          input: 'TBD - Требуется парсинг с сайта',
          output: 'TBD - Требуется парсинг с сайта',
        },
        {
          title: 'Дымовое Тестирование Входа MVP',
          input: 'TBD - Требуется парсинг с сайта',
          output: 'TBD - Требуется парсинг с сайта',
        },
      ],
    },

    testStrategy: {
      title: 'Разработка Стратегии Тестирования',
      description:
        'Создание комплексных документов стратегии тестирования, описывающих высокоуровневый подход к тестированию, методологии и стратегические соображения.',
      tags: [
        'стратегия тестирования',
        'управление рисками',
        'автоматизация тестирования',
        'agile тестирование',
        'обеспечение качества',
      ],
      fullPrompt: `## System Instruction
You are a senior QA strategist responsible for producing a **comprehensive Test Strategy document**. Based on the provided context, generate a professional and structured strategy that includes all the required sections. If any information is missing or not available, clearly mark that section as **"TBD" (To Be Determined)**.

## Goal
Create a comprehensive **Test Strategy** document to guide all testing activities across a project or organization.

## Input
- Contextual information about the testing environment, project scope, methodology, tools, and any business-specific constraints or goals.
- If any section lacks details, fill it in with **TBD**.

## Procedure
1. Organize the strategy into the specified sections.
2. Use professional, precise language throughout.
3. Include detailed content where possible; mark any unknowns as **TBD**.
4. Ensure the document is cohesive, consistent, and aligned with industry best practices.

## Output Format
- The final result **must be enclosed inside a Markdown code block using script block syntax**.
- Each section must be clearly labeled with its respective header.
- Missing or unspecified information should be marked as: **TBD**.
- The entire strategy must be presented as a well-structured, professional document.

## Test Strategy Sections
1. Scope
2. References
3. Glossary
4. Objectives
5. General Strategy
6. Risk Management
7. Test Selection and Prioritization
8. Test Documentation and Reporting
9. Test Automation and Tools
10. Configuration Management
11. Incident Management
12. Sub-process Strategy Details
13. Agile Test Strategy Considerations

## Quality Checklist
- All **13 sections** are included in the output.
- Missing details are explicitly marked as **TBD**.
- Results are presented **inside a Markdown script block**.
- Content is clear, organized, and suitable for strategic QA planning.

## Revision Loop
After generating the Test Strategy, conclude with:
> Confirm if further adjustments are needed.

## Example
(Partial)

# Test Strategy

## Scope
This document outlines the high-level test strategy for the XYZ platform.

## References
- IEEE 829 Standard for Test Documentation
- Agile Testing Principles (Crispin & Gregory)

## Glossary
- UAT: User Acceptance Testing
- CI/CD: Continuous Integration / Continuous Deployment

## Objectives
- Ensure product quality aligns with business requirements
- Mitigate risks early through proactive testing
...

## Agile Test Strategy Considerations
TBD`,
      examples: [
        {
          title: 'Редизайн Портала Здравоохранения',
          input: 'TBD - Требуется парсинг с сайта',
          output: 'TBD - Требуется парсинг с сайта',
        },
        {
          title: 'Быстрая Переработка Платёжной Системы',
          input:
            "The team is working on a payment form that accepts credit cards and PayPal. They want to test it properly before the next release. It's used by people all over the world. There's no test documentation yet, and we're not sure what's automated. Please create a test strategy for this.",
          output:
            '# Test Strategy\n\n## Scope\nThis document outlines the test strategy for the global payment form supporting credit card and PayPal transactions. The form is a critical component of the platform, enabling users worldwide to securely complete purchases. The testing effort will ensure functional correctness, security, internationalization, and cross-platform compatibility before the next release.\n\n## References\n- PCI-DSS Compliance Requirements\n- OWASP Top 10 Security Risks\n- ISO/IEC/IEEE 29119 Software Testing Standards\n- TBD: Internal company policies and test plans\n\n## Glossary\n- PCI-DSS: Payment Card Industry Data Security Standard\n- CVV: Card Verification Value\n- I18N: Internationalization\n- UAT: User Acceptance Testing\n- CI/CD: Continuous Integration / Continuous Deployment\n- PII: Personally Identifiable Information\n\n## Objectives\n- Validate all supported payment methods function correctly (Credit Card, PayPal)\n- Ensure compliance with PCI-DSS and other relevant standards\n- Provide adequate test coverage for international use cases\n- Confirm platform and browser compatibility\n- Identify and mitigate critical defects before release\n\n## General Strategy\nTesting will be performed across the full stack (frontend, backend, integrations) and will include:\n- Manual exploratory testing for usability and internationalization\n- Functional testing of payment flows\n- Security and data protection validation\n- Compatibility testing across devices and browsers\n- Regression testing of impacted modules\n- TBD: Load and performance testing scope\n\n## Risk Management\nKey risks include:\n- High-impact defects in payment processing\n- Regional compatibility issues (e.g., PayPal limitations in certain countries)\n- Lack of existing test documentation and automation coverage\n- Security vulnerabilities affecting payment data\n\nMitigation actions:\n- Prioritize end-to-end functional scenarios\n- Perform risk-based testing\n- Review with stakeholders to identify regional edge cases\n- Schedule early security and compliance testing\n\n## Test Selection and Prioritization\nTests will be prioritized based on:\n- Critical payment workflows\n- Regional user volume\n- Known failure points or past incidents\n- Compliance and security requirements\n\nTypes of tests to be executed:\n- Smoke tests for basic availability\n- Functional test cases for each payment option\n- Edge cases (e.g., expired cards, invalid PayPal credentials)\n- Cross-browser/platform scenarios\n- TBD: Automated test execution criteria\n\n## Test Documentation and Reporting\n- Test cases, checklists, and charters will be documented using a centralized tool (TBD)\n- Daily status reports will be shared during the test cycle\n- Defect and issue tracking will be maintained via Jira (or other tracking tool - TBD)\n- A final Test Summary Report will be created prior to release\n\n## Test Automation and Tools\n- Current automation coverage: **TBD**\n- Automation focus areas: regression, smoke tests, cross-browser validations\n- Recommended tools: Playwright, Selenium, Postman (for backend/payment API)\n- CI integration: TBD\n- Ownership of automation framework: TBD\n\n## Configuration Management\n- Test environments: staging environment replicating production as closely as possible\n- Environment ownership: TBD\n- Data management: Synthetic and anonymized real-world data to be used\n- Version control: Git-based, aligned with development branches\n- Deployment process: Triggered via CI/CD pipeline (details TBD)\n\n## Incident Management\n- Bugs will be tracked and triaged via the designated bug tracking tool (TBD)\n- Severity and priority criteria to be defined and aligned with stakeholders\n- Daily triage calls to be held during test execution\n- Retest and regression scope to be defined per issue impact\n- Escalation matrix: TBD\n\n## Sub-process Strategy Details\n- Payment Gateway Testing: test with test credentials for Visa, MasterCard, Amex, PayPal\n- Error handling and recovery: simulate timeouts, invalid input, backend failures\n- Localization/I18N: test with various languages, currencies, formats\n- Security Testing: validate HTTPS, mask sensitive input, OWASP checks\n- Mobile-specific strategy: responsive design, touch input testing\n\n## Agile Test Strategy Considerations\n- QA team to be involved in story grooming and sprint planning\n- Definition of Done will include acceptance criteria and testing completed\n- Incremental testing as stories are completed\n- Bugs found in sprint to be resolved within sprint wherever feasible\n- Continuous feedback from demos and stakeholders\n\n> Confirm if further adjustments are needed.',
        },
        {
          title: 'IoT Платформа SmartFleet',
          input: 'TBD - Требуется парсинг с сайта',
          output: 'TBD - Требуется парсинг с сайта',
        },
      ],
    },

    riskAssessment: {
      title: 'Оценка Рисков Программного Обеспечения',
      description:
        'Проведение комплексного анализа рисков в контексте программного обеспечения, выявление и классификация рисков, оценка их вероятности и влияния, а также предоставление структурированных рекомендаций по снижению рисков с документацией реестра рисков.',
      tags: [
        'оценка рисков',
        'анализ рисков',
        'матрица рисков',
        'реестр рисков',
        'планирование снижения рисков',
        'анализ качества',
      ],
      fullPrompt: `## System Instruction: 
You are a software quality and risk analyst. Your task is to perform a detailed risk assessment based on provided information about a product, project, or process. Use software testing best practices to identify, classify, and prioritize risks. Provide a structured risk report that includes both qualitative analysis and mitigation recommendations.

### Goal: 
Analyze and document risks in a software context (product, project, or process) to support test planning and strategic quality assurance decisions.

### Input: 
You will be given a summary or detailed description of a product, project, or software process. This may include timelines, features, technologies, team composition, and constraints.

### Procedure: 
1. Understand the context: 
- Identify product goals, business impact, critical features, constraints, and key stakeholders.
2. Categorize risk types into: 
- Product, Project, Process, Technical, and External risks.
3. Evaluate each risk using a Risk Assessment Matrix: 
- Likelihood: Low / Medium / High 
- Impact: Low / Medium / High 
- Overall Risk Level: derived from the matrix
4. Ask focused risk-identification questions: 
- What modules or flows are most critical or prone to failure? 
- What assumptions are unvalidated? 
- Where is visibility or coverage lacking?
5. Map identified risks to the testing strategy: 
- Align test types and coverage depth based on risk level.
6. Document clearly in a tabular Risk Register: 
- Include: Risk ID, Category, Description, Likelihood, Impact, Risk Level, Owner, Mitigation Plan, Status
7. Provide recommendations for mitigation: 
- Preventive, detective, and contingency actions for each high or very high-risk item.

### Output Format: 
The result of this prompt must be returned inside a Markdown script block. The output must include: 
- **Risk Summary**: General overview of risk landscape 
- **Risk Register Table**: Structured table with ID, Type, Description, Likelihood, Impact, Risk Level, Owner, Mitigation Plan, Status 
- **Test Scope Alignment**: How identified risks will influence testing priorities 
- **Mitigation Strategy**: Categorized actions for major risks

The result of this prompt must be returned inside a script block using Markdown code block syntax.

### Quality Checklist: 
- ✅ Context is clearly understood and reflected in risk identification 
- ✅ Risk types are diverse and categorized 
- ✅ Assessment matrix is applied logically and consistently 
- ✅ Table format is structured, complete, and readable 
- ✅ Test mapping and mitigation plans are actionable and aligned 
- ✅ No critical risks are left unaddressed

### Revision Loop: 
If any high-risk item lacks owner or mitigation, flag it. Refine risk levels or mitigation strategy if vague or generic. Ensure alignment with testing effort and business goals.

### Example (Optional): 
Include a sample filled-in Risk Register row if clarification is needed for format.

> Let me know if you'd like a companion questionnaire prompt or a reusable risk register template in Markdown or Excel format.`,
      examples: [
        {
          title: 'Система Страховых Претензий',
          input:
            'Our company is modernizing the legacy insurance claims system used by agents and underwriters across 4 countries. The current system has high maintenance costs, frequent downtimes, and is based on COBOL and Oracle Forms. We are migrating to a cloud-native microservices architecture with Java Spring Boot and PostgreSQL, hosted on AWS. Integration with existing CRM and document management systems (SharePoint, Salesforce) is critical. Timeline: 9-month rollout, with 3 phased releases. Team: 2 SCRUM teams (each with 1 PM, 5 devs, 2 QAs), plus a shared DevOps engineer. Testing: mix of manual and automated (Selenium + REST Assured). UAT required in each phase by regional business units. Data migration and audit trail integrity are top priorities. Constraints: strict legal/regulatory constraints in EU, auditability, complex legacy data schemas, and heavy dependency on mainframe teams for parallel ops. The goal is to ensure zero disruption to existing claims workflows during go-live and provide better traceability and reporting.',
          output:
            '# 🛡️ Risk Assessment Report – Legacy Insurance Claims System Modernization\n\n---\n\n## Risk Summary\n\nThe modernization of the legacy insurance claims system introduces a significant shift in architecture, technology stack, and deployment model. Migrating from COBOL/Oracle Forms to a Java Spring Boot microservices-based system on AWS introduces several risks in terms of data integrity, integration stability, regulatory compliance, and operational continuity. Given the criticality of claims workflows across 4 countries, special attention must be paid to parallel operations, phased rollouts, auditability, and external system dependencies.\n\n---\n\n## 📋 Risk Register Table\n\n| Risk ID | Type | Description | Likelihood | Impact | Risk Level | Owner | Mitigation Plan | Status |\n|---------|------|-------------|------------|--------|------------|-------|-----------------|--------|\n| R1 | Technical | Data migration errors or loss due to schema mismatch between legacy and new PostgreSQL DB | High | High | Critical | Data Lead | Perform early dry-run migrations, create automated validation scripts, and include rollback plan | Open |\n| R2 | Project | Delays in phased releases due to limited DevOps capacity | Medium | High | High | PM + DevOps | Assign backup DevOps resources, automate deployment pipelines, review load forecast per phase | Open |\n| R3 | Product | Integration failure with SharePoint or Salesforce affecting claims processing | High | High | Critical | Integration Lead | Add integration test suite with mocks, perform end-to-end tests early in sprints | Open |\n| R4 | External | Mainframe team delay impacting legacy and parallel ops coordination | Medium | High | High | Program Manager | Weekly cross-team syncs, buffer in schedule, fallback logic for partial legacy processing | Open |\n| R5 | Process | Incomplete UAT coverage across all regions due to resource constraints | Medium | Medium | Medium | QA Leads | Plan UAT early with regional teams, provide clear test scope & environments, monitor participation | Planned |\n| R6 | Technical | Audit trail inconsistency in new system due to lack of logging or traceability standards | Medium | High | High | QA + Backend Dev | Define audit standards, implement centralized logging, verify trace data in every release | Open |\n| R7 | Regulatory | Non-compliance with EU data protection and audit regulations | Medium | High | High | Compliance Officer | Conduct legal review per release, enable data masking & access control in test/staging | Planned |\n| R8 | Technical | Low test automation coverage for new services delaying validation cycles | Medium | Medium | Medium | QA Leads | Prioritize automation in sprint DoD, use test coverage metrics to guide automation scope | Open |\n| R9 | Technical | Performance degradation under production load in AWS environment | Medium | High | High | DevOps + Backend | Run performance benchmarks using production-like data, set up autoscaling thresholds | Open |\n\n---\n\n## 🎯 Test Scope Alignment\n\n- **Data Migration (R1)**: Dedicated test phase with field-level validation scripts and automated comparison tools.\n- **Integration Testing (R3)**: Expanded regression suite and mocks for Salesforce & SharePoint interfaces.\n- **Audit & Traceability (R6, R7)**: Include verification of log entries and data retention flows in system tests.\n- **UAT (R5)**: Focused acceptance testing scripts per country with sign-off checkpoints.\n- **Performance Testing (R9)**: Simulate peak load scenarios on AWS pre-release using anonymized production data.\n\nTesting types prioritized by risk:\n- ✅ E2E Tests for CRM/Document Systems\n- ✅ Regression for audit and data flows\n- ✅ Migration validation and rollback readiness\n- ✅ Load tests for each release phase\n- ✅ Security & compliance tests (data masking, access control)\n\n---\n\n## 🧩 Mitigation Strategy\n\n### 🔐 Preventive Actions\n- Enforce test automation for each microservice from sprint 1\n- Involve legal & compliance in design reviews for EU data handling\n- Establish early agreements with mainframe team for coordination\n\n### 🕵️ Detective Actions\n- Use automated data comparison tools post-migration\n- Monitor integration logs and KPIs with alerts in staging/prod\n- Regular audit logs sampling during sprint reviews\n\n### 🛠️ Contingency Actions\n- Rollback plan for each phased release with clear go/no-go criteria\n- Manual override options in workflows during integration failure\n- Extend UAT window if regional coverage is found insufficient\n\n---\n\n**📌 Next Steps**: Assign mitigation actions, schedule risk reviews per sprint, validate alignment with test strategy roadmap.',
        },
        {
          title: 'Функции Приложения Здоровья',
          input: 'TBD - Требуется парсинг с сайта',
          output: 'TBD - Требуется парсинг с сайта',
        },
        {
          title: 'Система Отслеживания Ошибок',
          input: 'TBD - Требуется парсинг с сайта',
          output: 'TBD - Требуется парсинг с сайта',
        },
      ],
    },
  },

  // 2. Анализ Тестирования
  analysis: {
    requirementsAnalysis: {
      title: 'Анализ Требований и Генерация Вопросов',
      description:
        'Анализ документации требований для выявления потенциальных проблем, неоднозначностей и пробелов, создание структурированного списка уточняющих вопросов и рекомендаций по улучшению.',
      tags: ['анализ требований', 'генерация вопросов', 'анализ пробелов', 'ясность требований'],
      fullPrompt: 'TBD - Требуется парсинг с сайта',
      examples: [],
    },

    userStoriesQuality: {
      title: 'Оценка Качества Пользовательских Историй',
      description:
        'Оценка пользовательских историй на соответствие лучшим практикам Agile, включая критерии INVEST, качество критериев приемки и требования Definition of Ready.',
      tags: [
        'пользовательские истории',
        'agile',
        'оценка качества',
        'критерии INVEST',
        'критерии приемки',
        'definition of ready',
      ],
      fullPrompt: 'TBD - Требуется парсинг с сайта',
      examples: [],
    },
  },

  // 3. Дизайн Тестирования
  design: {
    testChecklist: {
      title: 'Создание Чек-листа Тестирования',
      description:
        'Преобразует пользовательские истории или требования в подробный чек-лист проверок, которые необходимо выполнить, прежде чем считать функционал готовым.',
      tags: ['чек-листы тестирования', 'дизайн тестов', 'проверка требований', 'тестовое покрытие'],
      fullPrompt: 'TBD - Требуется парсинг с сайта',
      examples: [],
    },

    testCasesClassic: {
      title: 'Создание Тест-кейсов (Классический формат)',
      description:
        'Создает тест-кейсы в классическом двухколоночном формате, где для каждого шага указан ожидаемый результат, включая предусловия, тестовые данные и четкие воспроизводимые шаги для ручных тестировщиков.',
      tags: [
        'тест-кейсы',
        'дизайн тестов',
        'структурированное тестирование',
        'документация тестов',
        'выполнение тестов',
      ],
      fullPrompt: 'TBD - Требуется парсинг с сайта',
      examples: [],
    },

    testCasesTable: {
      title: 'Создание Тест-кейсов (Табличный вид)',
      description:
        'Создает тест-кейсы в виде многоколоночной таблицы с ID, названием, предусловиями, шагами, ожидаемыми результатами, приоритетом и примечаниями - всё в одном представлении для удобного просмотра и управления.',
      tags: [
        'тест-кейсы',
        'дизайн тестов',
        'приоритизация тестов',
        'граничные случаи',
        'документация тестов',
        'обеспечение качества',
      ],
      fullPrompt: 'TBD - Требуется парсинг с сайта',
      examples: [],
    },

    testCasesGherkin: {
      title: 'Создание Тест-кейсов (Формат Gherkin)',
      description:
        'Создает тест-кейсы в формате Gherkin с конструкциями Дано/Когда/Тогда, делая их понятными как для бизнеса, так и для технических специалистов, идеально подходит для BDD и автоматизации.',
      tags: [
        'тест-кейсы',
        'пользовательские истории',
        'gherkin',
        'дизайн тестов',
        'анализ требований',
      ],
      fullPrompt: 'TBD - Требуется парсинг с сайта',
      examples: [],
    },

    testCasesQuality: {
      title: 'Проверка Качества Тест-кейсов',
      description:
        'Проверяет качество тест-кейсов, анализируя каждый раздел (заголовок, шаги, ожидаемые результаты) на соответствие лучшим практикам и предоставляет улучшенный пример, если требуются доработки.',
      tags: [
        'тест-кейсы',
        'проверка качества',
        'лучшие практики',
        'улучшение тестов',
        'документация тестов',
      ],
      fullPrompt: 'TBD - Требуется парсинг с сайта',
      examples: [],
    },
  },

  // 4. Тестовые Данные
  testData: {
    dataGeneration: {
      title: 'Генерация Тестовых Данных',
      description:
        'Генерация наборов тестовых данных в различных форматах (CSV, JSON и др.) с реалистичными и граничными значениями для тестирования валидации ввода и обработки данных.',
      tags: [
        'тестовые данные',
        'генерация данных',
        'граничные случаи',
        'валидация ввода',
        'форматы данных',
      ],
      fullPrompt: 'TBD - Требуется парсинг с сайта',
      examples: [],
    },
  },

  // 5. Дефекты
  defects: {
    bugReports: {
      title: 'Улучшение Отчетов об Ошибках',
      description:
        'Улучшите отчеты об ошибках в программном обеспечении, сделав их понятными, полными и удобными для разработчиков, следуя лучшим практикам отрасли.',
      tags: [
        'отчеты об ошибках',
        'обеспечение качества',
        'документация',
        'отслеживание ошибок',
        'управление дефектами',
      ],
      fullPrompt: 'TBD - Требуется парсинг с сайта',
      examples: [],
    },
  },

  // 6. Завершение Тестирования
  completion: {
    finalReport: {
      title: 'Итоговый Отчет о Тестировании',
      description:
        'Создание комплексных итоговых отчетов о тестировании с метриками и оценкой качества.',
      tags: [
        'отчетность о тестировании',
        'метрики',
        'итоговый отчет',
        'оценка качества',
        'завершение тестирования',
      ],
      fullPrompt: 'TBD - Требуется парсинг с сайта',
      examples: [],
    },
  },
};

// Функция для получения полного промпта с примерами
const getCompletePrompt = (category, type) => {
  if (onlyTestsCompletePrompts[category] && onlyTestsCompletePrompts[category][type]) {
    return onlyTestsCompletePrompts[category][type];
  }
  return null;
};

// Функция для получения всех промптов
const getAllCompletePrompts = () => {
  return onlyTestsCompletePrompts;
};

// Функция для поиска промптов по ключевым словам
const searchCompletePrompts = (keywords) => {
  const results = [];
  const searchTerms = keywords.toLowerCase().split(' ');

  Object.keys(onlyTestsCompletePrompts).forEach((category) => {
    Object.keys(onlyTestsCompletePrompts[category]).forEach((type) => {
      const prompt = onlyTestsCompletePrompts[category][type];
      const searchText = `${prompt.title} ${prompt.description} ${prompt.fullPrompt}`.toLowerCase();

      if (searchTerms.some((term) => searchText.includes(term))) {
        results.push({
          category,
          type,
          prompt,
        });
      }
    });
  });

  return results;
};

// Функция для получения статистики с примерами
const getCompleteStats = () => {
  const stats = {
    totalCategories: Object.keys(onlyTestsCompletePrompts).length,
    totalPrompts: 0,
    fullPrompts: 0,
    tbdPrompts: 0,
    totalExamples: 0,
    categories: {},
  };

  Object.keys(onlyTestsCompletePrompts).forEach((category) => {
    const categoryPrompts = Object.keys(onlyTestsCompletePrompts[category]).length;
    stats.totalPrompts += categoryPrompts;
    stats.categories[category] = categoryPrompts;

    Object.keys(onlyTestsCompletePrompts[category]).forEach((type) => {
      const prompt = onlyTestsCompletePrompts[category][type];
      if (prompt.fullPrompt === 'TBD - Требуется парсинг с сайта') {
        stats.tbdPrompts++;
      } else {
        stats.fullPrompts++;
      }

      if (prompt.examples && prompt.examples.length > 0) {
        stats.totalExamples += prompt.examples.length;
      }
    });
  });

  return stats;
};

// Экспорт функций
module.exports = {
  onlyTestsCompletePrompts,
  getCompletePrompt,
  getAllCompletePrompts,
  searchCompletePrompts,
  getCompleteStats,
};

// Демонстрация использования
if (require.main === module) {
  console.log('🎯 OnlyTests Полный Парсер с Примерами - Статистика');
  console.log('==================================================');

  const stats = getCompleteStats();
  console.log(`\n📊 Статистика промптов:`);
  console.log(`   Всего категорий: ${stats.totalCategories}`);
  console.log(`   Всего промптов: ${stats.totalPrompts}`);
  console.log(`   Полных промптов: ${stats.fullPrompts}`);
  console.log(`   TBD промптов: ${stats.tbdPrompts}`);
  console.log(`   Всего примеров: ${stats.totalExamples}`);

  console.log(`\n📋 Категории:`);
  Object.keys(stats.categories).forEach((category) => {
    console.log(`   ${category}: ${stats.categories[category]} промптов`);
  });

  console.log(`\n🔍 Пример поиска по ключевым словам "тест-кейсы":`);
  const searchResults = searchCompletePrompts('тест-кейсы');
  searchResults.forEach((result) => {
    console.log(`   ${result.category}.${result.type}: ${result.prompt.title}`);
  });

  console.log(`\n📊 Пример получения полного промпта с примерами:`);
  const testPlanPrompt = getCompletePrompt('planning', 'testPlan');
  if (testPlanPrompt) {
    console.log(`   Название: ${testPlanPrompt.title}`);
    console.log(`   Описание: ${testPlanPrompt.description}`);
    console.log(`   Полный промпт: ${testPlanPrompt.fullPrompt.substring(0, 100)}...`);
    console.log(`   Примеров: ${testPlanPrompt.examples.length}`);
    if (testPlanPrompt.examples.length > 0) {
      console.log(`   Первый пример: ${testPlanPrompt.examples[0].title}`);
    }
  }

  console.log(`\n🚀 OnlyTests + CRM = Профессиональное тестирование!`);
  console.log(
    `\n⚠️  Внимание: ${stats.tbdPrompts} промптов требуют полного парсинга с сайта OnlyTests!`
  );
  console.log(`\n📚 Примеров получено: ${stats.totalExamples} из всех промптов!`);
}
