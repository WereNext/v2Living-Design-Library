import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search, Filter, Copy, Check } from "lucide-react";
import { Theme } from "../../hooks/useDesignSystems";
import { searchTokens, filterTokens, TokenSearchResult } from "../../utils/tokenSearch";
import { Button } from "../ui/button";
import { copyToClipboard } from "../../utils/tokenExporter";
import { toast } from "sonner@2.0.3";
import { useTokenEditor } from "../../contexts/TokenEditorContext";

interface TokenSearchProps {
  theme: Theme;
}

export function TokenSearch({ theme }: TokenSearchProps) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const { editedTokens } = useTokenEditor();

  const searchResults = useMemo(() => {
    const results = searchTokens(theme, query);
    return filterTokens(results, {
      category: categoryFilter !== "all" ? categoryFilter : undefined,
      editedTokens,
    });
  }, [theme, query, categoryFilter, editedTokens]);

  const categories = useMemo(() => {
    const cats = new Set(searchResults.map(r => r.category));
    return Array.from(cats);
  }, [searchResults]);

  const handleCopyPath = async (path: string) => {
    try {
      await copyToClipboard(`--${path.replace(/\./g, "-")}`);
      setCopiedPath(path);
      toast.success("Variable name copied!");
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleCopyValue = async (value: string) => {
    try {
      await copyToClipboard(value);
      toast.success("Value copied!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Token Search
        </CardTitle>
        <CardDescription>
          Fuzzy search across all design tokens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens by name, value, or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        {query && (
          <p className="text-sm text-muted-foreground">
            Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Results List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {searchResults.length === 0 && query && (
            <div className="text-center py-8 text-muted-foreground">
              No tokens found matching "{query}"
            </div>
          )}

          {searchResults.map((result, idx) => (
            <TokenResultCard
              key={idx}
              result={result}
              onCopyPath={handleCopyPath}
              onCopyValue={handleCopyValue}
              isCopied={copiedPath === result.path}
              isModified={editedTokens.has(result.path)}
            />
          ))}
        </div>

        {/* No Query State */}
        {!query && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Start typing to search tokens</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TokenResultCardProps {
  result: TokenSearchResult;
  onCopyPath: (path: string) => void;
  onCopyValue: (value: string) => void;
  isCopied: boolean;
  isModified: boolean;
}

function TokenResultCard({ result, onCopyPath, onCopyValue, isCopied, isModified }: TokenResultCardProps) {
  return (
    <div className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-mono">
              {result.category}
            </Badge>
            {isModified && (
              <Badge variant="secondary" className="text-xs">
                Modified
              </Badge>
            )}
          </div>
          <p className="font-medium text-sm font-mono truncate">
            --{result.path.replace(/\./g, "-")}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopyPath(result.path)}
          className="flex-shrink-0"
        >
          {isCopied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Color Preview */}
        {result.category === "colors" && (
          <div
            className="w-6 h-6 rounded border flex-shrink-0"
            style={{ background: result.value.startsWith("hsl") ? result.value : `hsl(${result.value})` }}
          />
        )}

        {/* Value */}
        <code className="text-xs text-muted-foreground flex-1 truncate">
          {result.value}
        </code>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCopyValue(result.value)}
          className="flex-shrink-0"
        >
          <Copy className="w-3 h-3" />
        </Button>
      </div>

      {/* Match Indicators */}
      <div className="flex gap-1 mt-2">
        {result.matches.map((match, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {match}
          </Badge>
        ))}
      </div>
    </div>
  );
}
