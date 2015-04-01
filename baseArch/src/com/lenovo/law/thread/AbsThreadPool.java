package com.lenovo.law.thread;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import com.lenovo.law.base.Constants;
import com.lenovo.law.log.AbsLogger;

public abstract class AbsThreadPool extends AbsLogger {
	protected int poolSize = 2;
	protected int poolMaxSize = 5;
	protected long aliveTime = 200;
	protected LinkedBlockingQueue<Runnable> Queue = null;
	protected ExecutorService exe = null;
	protected Map<Integer,Future<?>> resut = new HashMap<Integer,Future<?>>();
	
	public void execute(Integer id,Callable<?> call) throws Exception{
		if(this.exe==null)
			throw new Exception("Thread is not init");
		if(call==null)
			throw new Exception("Runnable task is null");
		Future<?> result = exe.submit(call);
		this.resut.put(id, result);
	}
	
	public void shutdown(){
		if(this.exe!=null)
			exe.shutdown();
	}
	
	public Map<Integer, Future<?>> getResut() {
		return resut;
	}

	public  int getPoolSize() {
		return poolSize;
	}
	public void setPoolSize(int poolSize) {
		this.poolSize = poolSize;
		this.poolMaxSize = poolSize*2;
	}
	public int getPoolMaxSize() {
		return poolMaxSize;
	}
	public void setPoolMaxSize(int poolMaxSize) {
		if(poolMaxSize<this.poolSize){
			this.getLogger().print(Constants.DEBUG, "Set poolMaxSize with poolSize");
			this.poolMaxSize = this.poolSize;
		}else{
			this.poolMaxSize = poolMaxSize;
		}
	}
	public long getAliveTime() {
		return aliveTime;
	}
	public void setAliveTime(long aliveTime) {
		this.aliveTime = aliveTime;
	}
	
	public boolean init() throws Exception{
		if(null==this.Queue)
			throw new Exception("Queue is null!");
		ThreadPoolExecutor executor = 
				new ThreadPoolExecutor(this.poolSize, this.poolMaxSize, 
										this.aliveTime, TimeUnit.MILLISECONDS,
										this.Queue);
		this.exe = executor;
		return true;
	}
	public LinkedBlockingQueue<Runnable> getQueue() {
		return Queue;
	}
	public void setQueue(LinkedBlockingQueue<Runnable> queue) {
		Queue = queue;
	}
	
	
}
