"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LogService } from "services/services";
import { LogTypes, SortOrder } from "util/enums";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Log } from "services/types";
import { FaBug, FaExclamationTriangle, FaCopy } from "react-icons/fa";
import { FcInfo } from "react-icons/fc";

const LogTypeBadge = ({ type }: { type: LogTypes }) => {
  switch (type) {
    case LogTypes.error:
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
          <FaBug />
        </span>
      );
    case LogTypes.warning:
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600">
          <FaExclamationTriangle />
        </span>
      );
    case LogTypes.info:
    default:
      return (
        <span className="flex items-center justify-center rounded-full">
          <FcInfo size={30} />
        </span>
      );
  }
};

const LogStack = ({ stack }: { stack: string }) => {
  const [expanded, setExpanded] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(stack);
    // Optional: Add toast or visual feedback here
  };

  return (
    <div className="relative group">
      <div
        onClick={() => setExpanded(!expanded)}
        className={`text-[10px] text-gray-300 font-mono bg-slate-800/50 p-2 rounded overflow-x-auto whitespace-pre-wrap cursor-pointer hover:bg-slate-800 transition-colors pr-8 ${
          expanded ? "" : "max-h-[60px] overflow-hidden"
        }`}
      >
        {expanded ? stack : `${stack.substring(0, 300)}...`}
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-gray-500 hover:text-white bg-slate-700/50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy stack trace"
      >
        <FaCopy size={12} />
      </button>
    </div>
  );
};

const LogList = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [logTypeFilter, setLogTypeFilter] = useState<string>("all");

  const queryParams = useMemo(() => {
    const params: any = {
      page: currentPage + 1,
      limit: size,
      sort: "datetime",
      order: SortOrder.desc,
      search: searchTerm,
    };
    if (logTypeFilter !== "all") {
      params.type = logTypeFilter;
    }
    return params;
  }, [currentPage, size, searchTerm, logTypeFilter]);

  const {
    data: logsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["logs", queryParams],
    queryFn: () => LogService.getLogs(queryParams).then((res) => res.data),
    placeholderData: (previousData) => previousData,
  });

  const logs = useMemo(() => {
    return logsData?.data?.items || [];
  }, [logsData]);

  const { total } = useMemo(() => {
    return logsData?.data || { limit: 15, page: 1, total: 0 };
  }, [logsData]);

  const totalPages = Math.ceil(total / size);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 p-4 rounded-md">
        <h2 className="font-semibold text-lg mb-2">Logs</h2>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col gap-1 flex-1 max-w-sm">
            <label className="text-sm text-gray-600">Search</label>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by message, email, ip..."
              className="h-9"
            />
          </div>

          <div className="flex flex-col gap-1 w-[150px]">
            <label className="text-sm text-gray-600">Type</label>
            <Select value={logTypeFilter} onValueChange={setLogTypeFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.values(LogTypes).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setLogTypeFilter("all");
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="flex gap-1 flex-col">
        {isLoading && <div className="p-4 text-center text-gray-500">Loading logs...</div>}

        {!isLoading && logs.length === 0 && <div className="p-4 text-center text-gray-500">No logs found.</div>}

        {logs.map((log: Log) => (
          <div key={log._id} className="flex gap-3 border-b last:border-0 border-gray-500/30 p-3">
            <div className="w-[50px] flex-shrink-0 flex justify-center pt-1">
              <LogTypeBadge type={log.type} />
            </div>

            <div className="flex-1 flex flex-col gap-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span className="font-mono">{format(new Date(log.datetime), "yyyy-MM-dd HH:mm")}</span>
                <span className="font-mono">{log.ip || "No IP"}</span>
                {log.identityEmail && (
                  <span className="bg-slate-700/50 px-1.5 py-0.5 rounded text-gray-300 font-medium">
                    {log.identityEmail}
                  </span>
                )}
                {log.errorCode && <span className="text-red-400 font-bold">Err: {log.errorCode}</span>}
              </div>

              <div className="font-semibold text-gray-300 break-words text-sm mt-1">{log.message}</div>

              <div className="text-xs text-gray-500 flex flex-col gap-1 mt-1">
                {log.useragent && (
                  <span className="truncate max-w-full opacity-60" title={log.useragent}>
                    {log.useragent}
                  </span>
                )}
                {log.stack && <LogStack stack={log.stack} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Pagination */}
      <div className="flex justify-between items-center mt-2 p-2">
        <div className="text-sm text-gray-500">
          Page {currentPage + 1} of {totalPages} (total: {total})
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogList;
