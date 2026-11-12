import React, { useState } from 'react';
import {
  Music,
  AudioLines,
  Radio,
  Gamepad2,
  Search,
  Download,
  Copy,
  Check,
  ArrowUpRight,
  Bot,
} from 'lucide-react';
import { Language, Translations, ProjectItem } from '../types';
import { PROJECTS_DATA } from '../data/projects';

interface ProjectsCardsProps {
  language: Language;
  t: Translations;
}

export const ProjectsCards: React.FC<ProjectsCardsProps> = ({ language, t }) => {
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const handleCopy = (handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(handle);
    setCopiedHandle(handle);
    setTimeout(() => {
      setCopiedHandle(null);
    }, 1800);
  };

  const getProjectIcon = (icon: ProjectItem['icon']) => {
    switch (icon) {
      case 'music':
        return <Music className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case 'shazam':
        return <AudioLines className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case 'radio':
        return <Radio className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case 'game':
        return <Gamepad2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case 'search':
        return <Search className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case 'download':
        return <Download className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
      case 'letter-e':
        return (
          <span className="w-4 h-4 flex items-center justify-center font-bold text-xs text-zinc-900 dark:text-zinc-100 leading-none select-none">
            E
          </span>
        );
      default:
        return <Bot className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />;
    }
  };

  return (
    <section id="projects-section" className="w-full space-y-3">
      <div className="px-1">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Projects
        </h2>
      </div>

      <div className="space-y-2.5">
        {PROJECTS_DATA.map((project) => (
          <div
            key={project.id}
            id={`project-card-${project.id}`}
            className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            {/* Left side: Icon, Name, Handle, Description */}
            <div className="flex items-start gap-3.5 mb-3 sm:mb-0">
              <div className="mt-0.5 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex-shrink-0 flex items-center justify-center">
                {getProjectIcon(project.icon)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {project.name}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {project.handle}
                  </span>
                  <button
                    onClick={(e) => handleCopy(project.handle, e)}
                    className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    title={copiedHandle === project.handle ? t.copied : t.copyHandle}
                    aria-label={t.copyHandle}
                  >
                    {copiedHandle === project.handle ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-md">
                  {project.description[language]}
                </p>
              </div>
            </div>

            {/* Right side: Type Badge and Direct Open Action */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200/60 dark:border-zinc-800">
                  {project.typeLabel}
                </span>
                {project.extraBadge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200/60 dark:border-zinc-800">
                    {project.extraBadge}
                  </span>
                )}
              </div>

              <a
                id={`project-open-${project.id}`}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
              >
                <span>{t.openProject}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
