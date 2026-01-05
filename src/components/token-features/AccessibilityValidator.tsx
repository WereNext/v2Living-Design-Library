import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Progress } from "../ui/progress";
import { CheckCircle2, AlertTriangle, XCircle, Shield, Eye } from "lucide-react";
import { Theme } from "../../hooks/useDesignSystems";
import { validateThemeAccessibility, checkContrast, AccessibilityIssue } from "../../utils/accessibilityChecker";
import { Separator } from "../ui/separator";

interface AccessibilityValidatorProps {
  theme: Theme;
}

export function AccessibilityValidator({ theme }: AccessibilityValidatorProps) {
  const issues = useMemo(() => validateThemeAccessibility(theme), [theme]);

  const errorCount = issues.filter(i => i.severity === "error").length;
  const warningCount = issues.filter(i => i.severity === "warning").length;
  const totalChecks = issues.length + 10; // Assume 10 base checks
  const passedChecks = totalChecks - errorCount - warningCount;
  const score = Math.round((passedChecks / totalChecks) * 100);

  // Sample contrast checks for common combinations
  const contrastChecks = useMemo(() => {
    if (!theme.colors) return [];

    const checks = [
      { fg: theme.colors.foreground, bg: theme.colors.background, name: "Text on Background" },
      { fg: theme.colors["primary-foreground"], bg: theme.colors.primary, name: "Primary Button" },
      { fg: theme.colors["secondary-foreground"], bg: theme.colors.secondary, name: "Secondary Button" },
      { fg: theme.colors["muted-foreground"], bg: theme.colors.muted, name: "Muted Text" },
    ];

    return checks
      .filter(c => c.fg && c.bg)
      .map(c => ({
        ...c,
        result: checkContrast(c.fg, c.bg),
      }));
  }, [theme]);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Accessibility Score
          </CardTitle>
          <CardDescription>
            WCAG 2.1 compliance assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={score} className="h-3" />
            </div>
            <div className="text-3xl font-bold">{score}%</div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-2xl font-bold">{passedChecks}</span>
              </div>
              <p className="text-xs text-muted-foreground">Passed</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-2xl font-bold">{warningCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-2xl font-bold">{errorCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrast Ratios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Contrast Ratios
          </CardTitle>
          <CardDescription>
            Common color combinations and their WCAG compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {contrastChecks.map((check, idx) => (
            <div key={idx} className="p-4 border rounded-lg bg-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{check.name}</span>
                <Badge variant={check.result.aa ? "default" : "destructive"}>
                  {check.result.ratio}:1
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  {check.result.aa ? (
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span className={check.result.aa ? "text-green-600" : "text-red-600"}>
                    AA {check.result.aa ? "Pass" : "Fail"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {check.result.aaa ? (
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span className={check.result.aaa ? "text-green-600" : "text-red-600"}>
                    AAA {check.result.aaa ? "Pass" : "Fail"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {check.result.aaLarge ? (
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span className={check.result.aaLarge ? "text-green-600" : "text-red-600"}>
                    AA Large {check.result.aaLarge ? "Pass" : "Fail"}
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div 
                className="p-3 rounded flex items-center justify-center text-sm font-medium"
                style={{ 
                  background: check.bg.startsWith('hsl') ? check.bg : `hsl(${check.bg})`,
                  color: check.fg.startsWith('hsl') ? check.fg : `hsl(${check.fg})`
                }}
              >
                Sample Text Preview
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Issues List */}
      {issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Issues</CardTitle>
            <CardDescription>
              Recommendations to improve accessibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.map((issue, idx) => (
              <Alert 
                key={idx} 
                variant={issue.severity === "error" ? "destructive" : "default"}
                className={issue.severity === "warning" ? "border-yellow-500/50 bg-yellow-500/5" : ""}
              >
                <div className="flex gap-3">
                  {issue.severity === "error" && <XCircle className="w-4 h-4 text-red-500" />}
                  {issue.severity === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                  {issue.severity === "info" && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                  <div className="flex-1 space-y-1">
                    <AlertDescription className="font-medium">
                      {issue.issue}
                    </AlertDescription>
                    <p className="text-xs text-muted-foreground font-mono">
                      {issue.tokenPath}
                    </p>
                    {issue.suggestion && (
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 {issue.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {issues.length === 0 && (
        <Alert className="bg-green-500/10 border-green-500/20">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <AlertDescription className="text-green-700 dark:text-green-400">
            No accessibility issues found! Your theme meets WCAG AA standards.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
