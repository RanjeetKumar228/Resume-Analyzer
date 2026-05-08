// Common ATS keywords by category
const COMMON_KEYWORDS = {
  technical: [
    'javascript', 'python', 'java', 'c++', 'c#', 'typescript', 'react', 'vue', 'angular',
    'node.js', 'express', 'django', 'flask', 'spring', 'mongodb', 'sql', 'mysql', 'postgresql',
    'html', 'css', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'rest', 'graphql',
    'ci/cd', 'jenkins', 'gitlab', 'github', 'bitbucket', 'agile', 'scrum', 'jira'
  ],
  soft: [
    'communication', 'teamwork', 'leadership', 'problem solving', 'analytical',
    'project management', 'time management', 'collaboration', 'adaptability',
    'attention to detail', 'critical thinking', 'creativity'
  ],
  experience: [
    'internship', 'experience', 'years of experience', 'worked on', 'responsible for',
    'managed', 'developed', 'implemented', 'designed', 'led', 'coordinated'
  ],
  education: [
    'bachelor', 'master', 'diploma', 'degree', 'certification', 'certified',
    'university', 'college', 'institute', 'school', 'gpa', 'honors'
  ]
};

// Extract education details
const extractEducation = (text) => {
  const educationKeywords = ['bachelor', 'master', 'diploma', 'degree', 'b.tech', 'b.s.', 'm.s.', 'm.tech', 'b.a.', 'm.a.'];
  const education = [];
  
  const lines = text.split('\n');
  let inEducation = false;
  let tempEducation = [];
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('education') || lowerLine.includes('academic')) {
      inEducation = true;
      return;
    }
    
    if (inEducation && (lowerLine.includes('experience') || lowerLine.includes('projects') || lowerLine.includes('skills'))) {
      if (tempEducation.length > 0) {
        education.push(tempEducation.join(' '));
        tempEducation = [];
      }
      inEducation = false;
    }
    
    if (inEducation && educationKeywords.some(keyword => lowerLine.includes(keyword))) {
      tempEducation.push(line.trim());
    }
  });
  
  if (tempEducation.length > 0) {
    education.push(tempEducation.join(' '));
  }
  
  return education;
};

// Extract experience details
const extractExperience = (text) => {
  const experience = [];
  const experienceKeywords = ['experience', 'employment', 'work history'];
  
  const lines = text.split('\n');
  let inExperience = false;
  let tempExperience = [];
  
  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();
    
    if (experienceKeywords.some(keyword => lowerLine.includes(keyword))) {
      inExperience = true;
      return;
    }
    
    if (inExperience && (lowerLine.includes('education') || lowerLine.includes('projects') || lowerLine.includes('skills'))) {
      if (tempExperience.length > 0) {
        experience.push(tempExperience.join(' '));
        tempExperience = [];
      }
      inExperience = false;
    }
    
    if (inExperience && line.trim().length > 0) {
      // Job titles and descriptions usually have action verbs
      const actionVerbs = ['worked', 'developed', 'managed', 'led', 'designed', 'implemented', 'created'];
      if (actionVerbs.some(verb => lowerLine.includes(verb)) || /\d{4}/.test(line)) {
        if (tempExperience.length > 0) {
          experience.push(tempExperience.join(' '));
          tempExperience = [];
        }
      }
      tempExperience.push(line.trim());
    }
  });
  
  if (tempExperience.length > 0) {
    experience.push(tempExperience.join(' '));
  }
  
  return experience;
};

// Extract skills
const extractSkills = (text) => {
  const skills = new Set();
  const allKeywords = [...COMMON_KEYWORDS.technical, ...COMMON_KEYWORDS.soft];
  
  const lowerText = text.toLowerCase();
  
  allKeywords.forEach(keyword => {
    if (lowerText.includes(keyword.toLowerCase())) {
      skills.add(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  });
  
  return Array.from(skills);
};

// Extract projects
const extractProjects = (text) => {
  const projects = [];
  const lines = text.split('\n');
  let inProjects = false;
  let tempProject = [];
  
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('project') || lowerLine.includes('portfolio')) {
      inProjects = true;
      return;
    }
    
    if (inProjects && (lowerLine.includes('experience') || lowerLine.includes('education') || lowerLine.includes('skills'))) {
      if (tempProject.length > 0) {
        projects.push(tempProject.join(' '));
        tempProject = [];
      }
      inProjects = false;
    }
    
    if (inProjects && line.trim().length > 0) {
      tempProject.push(line.trim());
    }
  });
  
  if (tempProject.length > 0) {
    projects.push(tempProject.join(' '));
  }
  
  return projects;
};

// Calculate ATS Score
const calculateATSScore = (text, skills, education, experience) => {
  let score = 0;
  const lowerText = text.toLowerCase();
  
  // Check for required sections
  const sections = ['contact', 'email', 'phone', 'education', 'experience', 'skills'];
  const foundSections = sections.filter(section => lowerText.includes(section)).length;
  score += (foundSections / sections.length) * 20;
  
  // Check for skills (max 20 points)
  const skillScore = Math.min(skills.length * 2, 20);
  score += skillScore;
  
  // Check for education (max 15 points)
  if (education.length > 0) score += 15;
  
  // Check for experience (max 20 points)
  const experienceScore = Math.min(experience.length * 5, 20);
  score += experienceScore;
  
  // Check for projects (max 10 points)
  const projectMatch = lowerText.match(/project/gi);
  const projectScore = projectMatch ? Math.min(projectMatch.length * 2, 10) : 0;
  score += projectScore;
  
  // Check for certifications (max 10 points)
  const certMatch = lowerText.match(/certif|award|achievement/gi);
  const certScore = certMatch ? Math.min(certMatch.length * 2, 10) : 0;
  score += certScore;
  
  // Check for action verbs (max 10 points)
  const actionVerbs = ['developed', 'implemented', 'managed', 'led', 'designed', 'created', 'achieved'];
  const verbMatches = actionVerbs.filter(verb => lowerText.includes(verb)).length;
  const verbScore = Math.min(verbMatches * 1.5, 10);
  score += verbScore;
  
  return Math.min(Math.round(score), 100);
};

// Generate suggestions
const generateSuggestions = (text, skills, education, experience) => {
  const suggestions = [];
  const lowerText = text.toLowerCase();
  
  // Check for missing sections
  if (!lowerText.includes('education')) {
    suggestions.push('Add an Education section with degree details and institution name.');
  }
  
  if (!lowerText.includes('experience') && !lowerText.includes('work history')) {
    suggestions.push('Include an Experience section highlighting your work history.');
  }
  
  if (!lowerText.includes('skills')) {
    suggestions.push('Add a Skills section highlighting your technical and soft skills.');
  }
  
  if (skills.length < 5) {
    suggestions.push('Include more technical skills (aim for at least 5-10 relevant skills).');
  }
  
  if (!lowerText.includes('project') && !lowerText.includes('portfolio')) {
    suggestions.push('Consider adding a Projects section to showcase your work.');
  }
  
  if (!lowerText.includes('email') || !lowerText.includes('phone')) {
    suggestions.push('Make sure your contact information (email, phone) is clearly visible.');
  }
  
  if (!lowerText.includes('linkedin') && !lowerText.includes('github') && !lowerText.includes('portfolio')) {
    suggestions.push('Add links to your LinkedIn profile, GitHub, or portfolio website.');
  }
  
  // Check for weak action verbs
  const weakVerbs = ['worked', 'was', 'did', 'helped', 'involved'];
  const strongVerbs = ['developed', 'implemented', 'led', 'designed', 'managed', 'created'];
  
  const hasWeak = weakVerbs.some(verb => lowerText.includes(verb));
  const hasStrong = strongVerbs.some(verb => lowerText.includes(verb));
  
  if (hasWeak && !hasStrong) {
    suggestions.push('Use stronger action verbs in your experience section (e.g., "Developed", "Implemented", "Led").');
  }
  
  if (text.length < 200) {
    suggestions.push('Your resume seems short. Add more details about your qualifications.');
  }
  
  return suggestions;
};

// Main analysis function
exports.analyzeResume = (text) => {
  if (!text || text.trim().length === 0) {
    return {
      skills: [],
      education: [],
      experience: [],
      projects: [],
      atsScore: 0,
      suggestions: ['Resume text is empty. Please provide a valid resume.']
    };
  }

  const skills = extractSkills(text);
  const education = extractEducation(text);
  const experience = extractExperience(text);
  const projects = extractProjects(text);
  const atsScore = calculateATSScore(text, skills, education, experience);
  const suggestions = generateSuggestions(text, skills, education, experience);

  return {
    skills,
    education,
    experience,
    projects,
    atsScore,
    suggestions,
    missingKeywords: generateMissingKeywords(text, skills)
  };
};

// Detect missing high-impact keywords
const generateMissingKeywords = (text, foundSkills) => {
  const missing = [];
  const lowerText = text.toLowerCase();
  
  // Common high-impact keywords that are often missing
  const importantKeywords = [
    'agile', 'scrum', 'rest api', 'database', 'sql', 'cloud',
    'testing', 'debugging', 'version control', 'oop'
  ];
  
  importantKeywords.forEach(keyword => {
    if (!lowerText.includes(keyword)) {
      missing.push(keyword);
    }
  });
  
  return missing.length > 0 ? missing : null;
};

// Legacy function for backward compatibility
exports.analyzeText = (text) => {
  const analysis = exports.analyzeResume(text);
  return {
    keywordCount: analysis.skills.length,
    readabilityScore: analysis.atsScore,
    suggestions: analysis.suggestions
  };
};
